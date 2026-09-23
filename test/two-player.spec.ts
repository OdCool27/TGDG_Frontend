import { test, expect, Page, BrowserContext } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { apiOrigin } from '../src/api/baseUrl';

const appOrigin = process.env.E2E_APP_ORIGIN || 'http://localhost:3000';
const api = process.env.E2E_API_BASE_URL || 'http://localhost:3001';

test('API base URL rejects path-based ports and accepts real origins', () => {
  expect(apiOrigin(' https://date.example/ ')).toBe('https://date.example');
  expect(apiOrigin('http://localhost:3001')).toBe('http://localhost:3001');
  for (const value of ['https://date.example/3001', 'https://date.example/api/v1', '/3001', 'ftp://date.example', 'https://u:p@date.example', 'https://date.example?x=1']) {
    expect(() => apiOrigin(value)).toThrow('must be a server origin');
  }
});

// Serve the built frontend under its configured origin without deploying it.
// API calls still go directly to the real backend, including browser CORS.
async function prepare(context: BrowserContext) {
  if (process.env.E2E_USE_DIST !== 'true') return;
  await context.route(appOrigin + '/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const file = path.startsWith('/assets/') ? path.slice(1) : 'index.html';
    const types: Record<string,string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
    await route.fulfill({ body: await readFile(resolve('dist', file)), contentType: types[extname(file)] || 'application/octet-stream' });
  });
}

async function state(page: Page): Promise<any> {
  return page.evaluate(async base => {
    const id = localStorage.getItem('date_glitch_live_session_id');
    const token = localStorage.getItem('date_glitch_live_player_token');
    const response = await fetch(base + '/api/v1/sessions/' + id, { headers: { Authorization: 'Bearer ' + token } });
    if (!response.ok) throw new Error('Session read failed: ' + response.status);
    return response.json();
  }, api);
}

test('two browser players create, join, recover and finish all 15 scenes', async ({ browser }) => {
  const hostContext = await browser.newContext();
  const guestContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const errors: string[] = [];
  try {
    await prepare(hostContext); await prepare(guestContext);
    const host = await hostContext.newPage(), guest = await guestContext.newPage();
    for (const page of [host, guest]) page.on('pageerror', error => errors.push(error.message));
    await host.goto(appOrigin);
    await host.getByRole('button', { name: /Start a Date Room/ }).click();
    await host.getByPlaceholder('Enter your name...').fill('Flow Host');

    // A failed create must preserve the setup screen and entered character.
    await host.route(api + '/api/v1/sessions', route => route.fulfill({
      status: 503, contentType: 'application/json', body: JSON.stringify({ message: 'Test temporary failure' }),
    }), { times: 1 });
    await host.getByRole('button', { name: 'Create Date Room', exact: true }).click();
    await expect(host.getByRole('alert')).toContainText('Test temporary failure');
    await expect(host.getByPlaceholder('Enter your name...')).toHaveValue('Flow Host');
    await host.getByRole('button', { name: 'Create Date Room', exact: true }).click();
    await expect(host.getByRole('button', { name: 'Start Date (Waiting for Partner)' })).toBeDisabled();
    const initial = await state(host);
    await guest.goto(appOrigin + '/?join=' + initial.joinCode);
    await guest.getByPlaceholder('Enter your name...').fill('Flow Guest');

    let release!: () => void;
    const hold = new Promise<void>(resolve => { release = resolve; });
    await guest.route(api + '/api/v1/sessions/*/character', async route => { await hold; await route.continue(); }, { times: 1 });
    await guest.getByRole('button', { name: /Join Room/ }).click();
    await expect(host.getByRole('button', { name: 'Waiting for Partner Setup' })).toBeDisabled();
    release();
    await expect(host.getByRole('button', { name: 'Begin Date Call' })).toBeEnabled();
    await expect(guest.getByText('You are all set!')).toBeVisible();
    await host.getByRole('button', { name: 'Begin Date Call' }).click();

    for (let index = 0; index < 15; index++) {
      for (const page of [host, guest]) await expect(page.getByRole('button', { name: 'Skip to Decision' })).toBeVisible();
      const hs = await state(host), gs = await state(guest);
      expect(hs.currentScene.id).toBe(gs.currentScene.id);
      expect(hs.currentScene.choices.guest).toEqual([]);
      expect(gs.currentScene.choices.host).toEqual([]);
      await host.getByRole('button', { name: 'Skip to Decision' }).click();
      await host.getByRole('button', { name: hs.currentScene.choices.host[0].label, exact: false }).click();
      await host.getByRole('button', { name: 'Lock In Secret Action' }).click();
      await expect.poll(async () => (await state(guest)).submissionStatus.hostSubmitted).toBe(true);
      await expect(guest.getByRole('button', { name: 'Skip to Decision' })).toBeVisible();
      const hidden = await state(guest);
      expect(hidden.host.submittedChoiceId).toBeUndefined();
      expect(hidden.currentOutcome).toBeUndefined();
      await guest.getByRole('button', { name: 'Skip to Decision' }).click();
      await guest.getByRole('button', { name: gs.currentScene.choices.guest[0].label, exact: false }).click();
      await guest.getByRole('button', { name: 'Lock In Secret Action' }).click();
      const ready = (p: Page) => p.getByRole('button', { name: "I'm Ready for What's Next" });
      for (const page of [host, guest]) await expect(ready(page)).toBeVisible();
      expect((await state(host)).currentOutcome).toEqual((await state(guest)).currentOutcome);
      if (index === 0) {
        await host.reload(); await guest.reload();
        for (const page of [host, guest]) await expect(ready(page)).toBeVisible();
        await guestContext.setOffline(true);
        await expect(guest.getByRole('alert')).toContainText('Reconnecting');
        await guestContext.setOffline(false);
        await expect(guest.getByRole('alert')).toHaveCount(0);
      }
      await ready(host).click();
      expect((await state(guest)).status).toBe('outcome_revealed');
      await ready(guest).click();
      if (index % 5 === 4) {
        const title = index === 14 ? 'See Your Ending' : 'Continue to Chapter ' + (Math.floor(index / 5) + 2);
        for (const page of [host, guest]) await expect(page.getByRole('button', { name: title })).toBeEnabled();
        await host.getByRole('button', { name: title }).click();
        expect((await state(guest)).status).toBe('chapter_recap');
        await guest.getByRole('button', { name: title }).click();
      }
    }
    await expect.poll(async () => (await state(host)).status).toBe('ended');
    for (const page of [host, guest]) {
      const final = await state(page);
      expect(final.storyLog).toHaveLength(15);
      expect(final.ending.id).toBe('diplomatic');
      await expect(page.getByText(final.ending.title, { exact: true })).toBeVisible();
    }
    expect(errors).toEqual([]);
  } finally { await hostContext.close(); await guestContext.close(); }
});


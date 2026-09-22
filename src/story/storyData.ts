import {
  CombinedConsequence,
  SceneData,
  ChapterRecap,
  StoryEnding,
  TonightSituationState,
} from '../types/game';

export interface SceneCombinationKey {
  sceneId: string;
  hostChoiceId: string;
  guestChoiceId: string;
}

/**
 * Initial backend story state for Tonight's Situation view.
 */
export function getInitialTonightSituation(): TonightSituationState {
  return {
    timeRemaining: '25 minutes until 9:00 PM watch-party',
    deliveryStatus: 'Takeout: In transit · Courier approaching building',
    helperStatus: 'Mr. Henderson (3B): Downstairs neighbor listening for noise',
    activeComplication: 'Intercom buzzer shrieking; hallway echoes',
    customFacts: [
      { id: 'prep_time', label: 'Prep Time', value: '25 mins left', status: 'neutral' },
      { id: 'dinner_status', label: 'Dinner', value: 'In transit', status: 'neutral' },
      { id: 'neighbor', label: 'Neighbor (3B)', value: 'Volatile', status: 'warning' },
      { id: 'complication', label: 'Complication', value: 'Buzzer chaos', status: 'warning' },
    ],
    recentUpdateReason: 'Date Night #1 initialized. 25 minutes of prep time remain before your virtual watch-party.',
  };
}

/**
 * 4-Chapter Guided Romantic Comedy Story:
 * Each decision presents complete scene context with continuity, immediate goal, stakes, and decision prompt.
 */
export const STORY_SCENES: SceneData[] = [
  // =========================================================================
  // CHAPTER 1: Night One — The Delivery Dilemma & Building Chaos
  // Linked Decisions:
  // Scene 1.1: The Intercom & Wrong-Door Delivery (Initial mishap)
  // Scene 1.2: The Soy Sauce Spill & The Unmuted Webinar (Cost appears from Scene 1)
  // Scene 1.3: The Midnight Knock & Henderson's Verdict (Direct callback to Scene 1)
  // =========================================================================
  {
    id: 'scene_1_1',
    chapterNumber: 1,
    chapterTitle: 'Night One: First Impressions & The Delivery Dilemma',
    sceneNumber: 1,
    totalScenesInChapter: 3,
    title: 'The Intercom Buzzer Siege',
    settingName: 'Friday Night · 8:05 PM · Date Night Kickoff',
    backgroundVariant: 'split_date',
    continuity: 'Your webcams are live, hair freshly styled, and you have both just logged on with high hopes for Date Night #1.',
    immediateGoal: 'Direct the courier to the correct door and rescue both dinners before the bags are abandoned in the rain or confiscated by neighbor Henderson.',
    stakes: 'If you botch this, dinner is lost on the wet curb, Mr. Henderson files a building noise violation, and you burn 15 minutes of date prep time eating saltines.',
    decisionPrompt: 'How will you coordinate to salvage the delivery before the courier abandons it on the curb?',
    dialogue: [
      {
        id: 'd1_1',
        speaker: 'narrator',
        text: 'Just as you both raise your cartoon glasses for an opening toast, the hallway intercom buzzer erupts in an ear-splitting, unrelenting screech.',
      },
      {
        id: 'd1_2',
        speaker: 'host',
        text: 'Hold on—is someone leaning on my apartment buzzer with an elbow?! Let me check the intercom speaker.',
        hostExpression: 'shocked',
        guestExpression: 'neutral',
        hostPrivateThought: 'I told the restaurant building buzzer #402, not #302!',
      },
      {
        id: 'd1_3',
        speaker: 'courier',
        speakerName: 'Delivery Courier (via Intercom)',
        text: 'HELLO?! Whoever ordered the 12-person dumpling party for Apartment 3B, come down! The gate is stuck and I got 90 seconds before I dump this on the curb!',
        hostExpression: 'panicked',
        guestExpression: 'shocked',
      },
      {
        id: 'd1_4',
        speaker: 'neighbor',
        speakerName: 'Mr. Henderson (Apt 3B)',
        text: '*BANGING ON PIPES* Shut that buzzer off! Some of us are running a high-stakes poker tournament down here!',
        hostExpression: 'panicked',
        guestExpression: 'laughing',
      },
      {
        id: 'd1_5',
        speaker: 'guest',
        text: 'Wait, did your courier just threaten to leave our food in the rain?! My tracking app says they are literally circling your front gate!',
        hostExpression: 'panicked',
        guestExpression: 'determined',
        guestPrivateThought: 'I can call the driver directly, or I can help keep them calm so they don\'t drop the call.',
      },
    ],
    choices: {
      host: [
        {
          id: 'h_door_sprint',
          label: 'Sprint down to lobby in slippers',
          description: 'Dash down three flights of stairs in fuzzy slippers to intercept the driver face-to-face before they leave.',
          foreseenRisk: 'Leaves the webcam unattended with your front door unlocked and no keys in pocket.',
        },
        {
          id: 'h_door_intercom',
          label: 'Call neighbor Henderson on building intercom',
          description: 'Ring apartment 3B directly to politely ask Henderson to buzz the main gate and accept the food on the table.',
          foreseenRisk: 'Henderson is notoriously grumpy and might demand a portion of the food or lecture you on noise.',
        },
        {
          id: 'h_door_bribe',
          label: 'Message driver via app with cash tip promise',
          description: 'Message the courier through the delivery app promising a $10 cash tip if they wait for the elevator.',
          foreseenRisk: 'If the driver has their phone in a pocket in the rain, they will never see the text in time.',
        },
      ],
      guest: [
        {
          id: 'g_door_call',
          label: 'Call courier cell with real-time street directions',
          description: 'Use the delivery app customer hotline to call the driver and guide them directly to the courtyard gate.',
          foreseenRisk: 'The courier is shouting over traffic and might mishear the buzzer instructions or alley code.',
        },
        {
          id: 'g_door_backup',
          label: 'Order emergency backup dumplings immediately',
          description: 'Place an express 10-minute backup order from a 24-hour diner so you are guaranteed food either way.',
          foreseenRisk: 'Guarantees double expense and leaves the first driver arguing at the gate unattended.',
        },
        {
          id: 'g_door_webcam',
          label: 'Hold down the webcam fort with calm cover story',
          description: 'Stay steady on camera, monitor the apartment hallway audio, and feed live encouragement to your date.',
          foreseenRisk: 'Leaves all physical intervention solely in your partner\'s hands without tangible help.',
        },
      ],
    },
  },

  {
    id: 'scene_1_2',
    chapterNumber: 1,
    chapterTitle: 'Night One: First Impressions & The Delivery Dilemma',
    sceneNumber: 2,
    totalScenesInChapter: 3,
    title: 'The Soy Sauce Spill & The Unmuted Webinar',
    settingName: 'Friday Night · 8:30 PM · Desk Command Station',
    backgroundVariant: 'webinar_chaos',
    continuity: 'Thanks to your frantic hallway maneuvers, you are back at your desks with the takeout bag. But the high-adrenaline scramble has left your hands shaky and prep time ticking.',
    immediateGoal: 'Mute the rogue corporate conference call, clean the dark soy sauce off the electronics before the keyboard shorts out, and shepherd Barnaby away from the power cables.',
    stakes: 'If mishandled, Guest\'s department VP hears unfiltered date flirting on company record, Host\'s laptop dies into total blackout, and remaining prep time evaporates.',
    decisionPrompt: 'How will you divide responsibilities to avert a career broadcast and save the date hardware?',
    dialogue: [
      {
        id: 'd2_1',
        speaker: 'narrator',
        text: 'Host rips open the brown paper takeout sack. In the rush, a pressurized packet of dark soy sauce shoots across the desk, splattering right across the spacebar and webcam lens.',
      },
      {
        id: 'd2_2',
        speaker: 'host',
        text: 'NO! The soy sauce exploded! My keyboard is bathing in sodium, and everything on my camera looks like an oil painting!',
        hostExpression: 'panicked',
        guestExpression: 'shocked',
      },
      {
        id: 'd2_3',
        speaker: 'guest',
        text: 'Grab a napkin! Wait—OH NO. My laptop calendar just auto-joined my company-wide weekly retrospective call! The microphone is open and 45 coworkers are listening to our audio!',
        hostExpression: 'shocked',
        guestExpression: 'panicked',
      },
      {
        id: 'd2_4',
        speaker: 'announcer',
        speakerName: 'VP of Product (via Guest Laptop)',
        text: '...and on slide 4, our quarterly deliverables—wait, does someone have unmuted feedback about soy sauce?',
        hostExpression: 'panicked',
        guestExpression: 'embarrassed',
      },
      {
        id: 'd2_5',
        speaker: 'narrator',
        text: 'To make matters worse, Barnaby the neighbor\'s tuxedo Frenchie trots into the room, enticed by fried dumplings, and starts sniffing the live laptop power strip!',
      },
    ],
    choices: {
      host: [
        {
          id: 'h_sauce_wipe',
          label: 'Sacrifice cloth napkin to dab keyboard immediately',
          description: 'Disconnect the keyboard cable and absorb the liquid before it seeps into the motherboard circuitry.',
          foreseenRisk: 'Leaves the webcam greasy and blurry while you focus entirely on drying keys.',
        },
        {
          id: 'h_sauce_barnaby',
          label: 'Lure Barnaby away with a dumpling crust sacrifice',
          description: 'Toss a harmless piece of dumpling crust across the room to divert Barnaby from the live electrical cords.',
          foreseenRisk: 'Barnaby will now expect a continuous banquet of table scraps and refuse to leave your chair.',
        },
        {
          id: 'h_sauce_bluff',
          label: 'Roleplay as a senior corporate consultant over speaker',
          description: 'Lean toward the mic and spout buzzwords ("synergizing cross-functional deliverables") to cover for Guest.',
          foreseenRisk: 'Could escalate the misunderstanding if the VP asks for a formal budget projection.',
        },
      ],
      guest: [
        {
          id: 'g_sauce_forcequit',
          label: 'Emergency force-quit the corporate conference app',
          description: 'Smash Command-Q on the work application before the department manager finishes taking attendance.',
          foreseenRisk: 'Might sever the date video call if both applications share the same system audio driver.',
        },
        {
          id: 'g_sauce_guide',
          label: 'Quickly mute mic and guide Host through cleanup step-by-step',
          description: 'Mute your mic with a hotkey and coach Host through safely checking their keyboard connection.',
          foreseenRisk: 'Leaves Barnaby untended on the other side of the screen while giving verbal instructions.',
        },
        {
          id: 'g_sauce_humor',
          label: 'Draw humorous warning signs on digital screen whiteboard',
          description: 'Pop open a digital whiteboard to distract both of you with humor while cleaning up.',
          foreseenRisk: 'Does not physically clean the liquid off the electronics or stop Barnaby.',
        },
      ],
    },
  },

  {
    id: 'scene_1_3',
    chapterNumber: 1,
    chapterTitle: 'Night One: First Impressions & The Delivery Dilemma',
    sceneNumber: 3,
    totalScenesInChapter: 3,
    title: 'The Front-Door Knock & The Final Verdict',
    settingName: 'Friday Night · 9:45 PM · The Post-Chaos Twilight',
    backgroundVariant: 'split_date',
    continuity: 'The soy sauce is blotted, the work call is disconnected, and the dumplings are eaten. You are both laughing breathlessly over surviving the gauntlet.',
    immediateGoal: 'Handle the front-door surprise with neighbor Henderson smoothly and preserve the date\'s romantic momentum.',
    stakes: 'Mishandling the door risks an awkward building dispute or losing your pet-sitting privileges, while handling it with charm cements tonight as an unforgettable triumph.',
    decisionPrompt: 'How do you handle the surprise visitor at the door and seal the fate of Date Night #1?',
    dialogue: [
      {
        id: 'd3_1',
        speaker: 'narrator',
        text: 'Just as the conversation settles into that comfortable, quiet warmth where neither person wants to disconnect, three sharp knocks rattle Host\'s front door.',
      },
      {
        id: 'd3_2',
        speaker: 'host',
        text: 'Someone is knocking. It is 9:45 PM on a Friday. That has to be Mr. Henderson from 3B.',
        hostExpression: 'shocked',
        guestExpression: 'neutral',
      },
      {
        id: 'd3_3',
        speaker: 'neighbor',
        speakerName: 'Mr. Henderson (through the door)',
        text: 'Open up, 402! I know you are in there with the dog and the computer screen!',
        hostExpression: 'panicked',
        guestExpression: 'laughing',
      },
      {
        id: 'd3_4',
        speaker: 'guest',
        text: 'Do not panic! Whatever you do, keep the laptop angled so I can be your remote backup moral support.',
        hostExpression: 'determined',
        guestExpression: 'delighted',
      },
    ],
    choices: {
      host: [
        {
          id: 'h_knock_open',
          label: 'Open door with wide smile and introduce date via laptop',
          description: 'Swing the door open, proudly introduce your video date to Henderson, and invite him to take a bow.',
          foreseenRisk: 'Henderson might pull up a folding chair and stay for 45 minutes.',
        },
        {
          id: 'h_knock_barnaby',
          label: 'Hold Barnaby up like Simba at the peephole',
          description: 'Present the tuxedo-wearing Frenchie at the eyehole as the apartment\'s official peace diplomat.',
          foreseenRisk: 'Barnaby might let out a loud snort right through the peephole and startle him.',
        },
        {
          id: 'h_knock_sincere',
          label: 'Step into hallway for a gracious 60-second check-in',
          description: 'Step outside momentarily to thank Henderson directly, apologize for the noise, and ask for privacy.',
          foreseenRisk: 'Leaves your date waiting alone on screen for a moment.',
        },
      ],
      guest: [
        {
          id: 'g_knock_wave',
          label: 'Wave enthusiastically at Henderson through the webcam',
          description: 'Lean into the camera and give Henderson a heartfelt, charismatic greeting across the internet.',
          foreseenRisk: 'Henderson might squint and wonder why a television screen is addressing him by name.',
        },
        {
          id: 'g_knock_cheer',
          label: 'Stage a mock standing ovation over the speakers',
          description: 'Applaud through the computer audio to give Henderson the entrance of an arena rockstar.',
          foreseenRisk: 'Might echo down the apartment building hallway and irritate other tenants.',
        },
        {
          id: 'g_knock_cozy',
          label: 'Sip tea calmly and wait for the coast to clear',
          description: 'Enjoy the spectacle from your desk and let Host handle the local building politics.',
          foreseenRisk: 'Misses an opportunity to charm the neighbor together as a team.',
        },
      ],
    },
  },

  // =========================================================================
  // CHAPTER 2: Night Two — The Watch-Party & Quirky Habits
  // =========================================================================
  {
    id: 'scene_2_1',
    chapterNumber: 2,
    chapterTitle: 'Night Two: The Watch-Party & Quirks',
    sceneNumber: 1,
    totalScenesInChapter: 2,
    title: 'The Great Video Playback Countdown',
    settingName: 'Saturday Night · 8:15 PM · Virtual Cinema',
    backgroundVariant: 'split_date',
    continuity: 'After surviving the first date\'s delivery gauntlet, you both eagerly scheduled Movie Night for Saturday.',
    immediateGoal: 'Press "Play" at the exact same millisecond so your video streams stay in sync without echo or lag.',
    stakes: 'If you desync, one person will laugh at jokes five seconds before the other sees them, ruining the movie immersion.',
    decisionPrompt: 'How will you synchronize your playback across the internet?',
    dialogue: [
      {
        id: 'd4_1',
        speaker: 'narrator',
        text: 'You both settled into armchairs with popcorn bowls, ready to stream an indie comedy together.',
      },
      {
        id: 'd4_2',
        speaker: 'host',
        text: 'Okay, count down with me: Three, two, one, hit play! Wait, did your studio fanfare already start?',
        hostExpression: 'neutral',
        guestExpression: 'laughing',
      },
      {
        id: 'd4_3',
        speaker: 'guest',
        text: 'Mine is still loading the trailer! Pause! You are living four seconds in the future!',
        hostExpression: 'laughing',
        guestExpression: 'embarrassed',
      },
    ],
    choices: {
      host: [
        {
          id: 'h_sync_countdown',
          label: 'Do a theatrical military-grade countdown with finger snaps',
          description: 'Call out a precise 5-second countdown with finger snaps right against the microphone.',
          foreseenRisk: 'The audio lag might actually make the sync discrepancy worse.',
        },
        {
          id: 'h_sync_ditch',
          label: 'Propose ditching the movie entirely to just keep talking',
          description: 'Admit that the movie was just an excuse to hang out and suggest talking all night instead.',
          foreseenRisk: 'Leaves the rented movie unwatched on both credit cards.',
        },
      ],
      guest: [
        {
          id: 'g_sync_embrace',
          label: 'Embrace the 5-second spoiler lag as a comedy game',
          description: 'Try to predict the actors\' dialogue based on your partner\'s facial expressions ahead of you.',
          foreseenRisk: 'You will miss the entire actual movie plot.',
        },
        {
          id: 'g_sync_talk',
          label: 'Second the motion to ditch the movie for deep conversation',
          description: 'Shut the streaming tab immediately and pull your tea mug closer to the camera.',
          foreseenRisk: 'No turning back to casual entertainment.',
        },
      ],
    },
  },

  {
    id: 'scene_2_2',
    chapterNumber: 2,
    chapterTitle: 'Night Two: The Watch-Party & Quirks',
    sceneNumber: 2,
    totalScenesInChapter: 2,
    title: 'The Accidental Screen Share',
    settingName: 'Saturday Night · 10:00 PM · Desktop Exposé',
    backgroundVariant: 'webinar_chaos',
    continuity: 'Having abandoned the movie in favor of hilarious conversation, you decide to share a funny travel photo.',
    immediateGoal: 'Navigate the accidental revelation of your private bookmarks and playlists with humor and vulnerability.',
    stakes: 'An awkward reaction could make the other person feel judged or self-conscious about their eccentric tastes.',
    decisionPrompt: 'How do you handle the unintended glimpse into your private digital life?',
    dialogue: [
      {
        id: 'd5_1',
        speaker: 'narrator',
        text: 'Host clicks "Share Window," but accidentally shares their entire desktop screen instead of the photo.',
      },
      {
        id: 'd5_2',
        speaker: 'guest',
        text: 'Wait... is that a browser tab titled "how to tell if someone likes you over webcam"?! And a playlist called "Pre-Date Panic Jams"?!',
        hostExpression: 'panicked',
        guestExpression: 'delighted',
      },
      {
        id: 'd5_3',
        speaker: 'host',
        text: 'I WAS SET UP! That was research for a scientific sociological paper!',
        hostExpression: 'embarrassed',
        guestExpression: 'laughing',
      },
    ],
    choices: {
      host: [
        {
          id: 'h_share_sing',
          label: 'Play the top song on the playlist and sing along loudly',
          description: 'Lean into the embarrassing music choice and perform the chorus live with a wooden spoon.',
          foreseenRisk: 'Your singing voice might wake up neighbor Henderson downstairs.',
        },
        {
          id: 'h_share_inspect',
          label: 'Demand to inspect Guest\'s browser tabs in fair retaliation',
          description: 'Playfully demand that Guest share their screen to reveal their own weird bookmarks.',
          foreseenRisk: 'They might actually share something even more unhinged.',
        },
      ],
      guest: [
        {
          id: 'g_share_duet',
          label: 'Join in as backup singer with maximum passion',
          description: 'Sing harmony on the embarrassing track without skipping a beat.',
          foreseenRisk: 'Complete vocal discord over the microphone.',
        },
        {
          id: 'g_share_confess',
          label: 'Admit you spent an hour googling their favorite hobbies',
          description: 'Confess your own pre-date curiosity to match their vulnerability.',
          foreseenRisk: 'Reveals just how thoroughly you were already interested.',
        },
      ],
    },
  },

  // =========================================================================
  // CHAPTER 3: Night Three — The 1:00 AM Deep Talk
  // =========================================================================
  {
    id: 'scene_3_1',
    chapterNumber: 3,
    chapterTitle: 'Night Three: The Late Night Deep Conversation',
    sceneNumber: 1,
    totalScenesInChapter: 2,
    title: 'The Midnight Frequency',
    settingName: 'Wednesday Night · 1:15 AM · The Real Talk',
    backgroundVariant: 'split_date',
    continuity: 'What started as a quick 10-minute check-in has drifted past 1:00 AM on a weeknight.',
    immediateGoal: 'Cross the bridge from playful banter to genuine, vulnerable emotional connection.',
    stakes: 'Keeping up a protective wall might keep things surface-level, while opening up too fast feels risky.',
    decisionPrompt: 'What deeper truth do you choose to share in the quiet of midnight?',
    dialogue: [
      {
        id: 'd7_1',
        speaker: 'narrator',
        text: 'The city outside is silent. Both of you are wearing comfortable oversized hoodies, sipping chamomile tea in the low glow of desk lamps.',
      },
      {
        id: 'd7_2',
        speaker: 'host',
        text: 'You know, I usually find small talk exhausting. But with you, hours just melt away like nothing.',
        hostExpression: 'delighted',
        guestExpression: 'delighted',
      },
      {
        id: 'd7_3',
        speaker: 'guest',
        text: 'Same here. I was actually having a really rough week before we started talking tonight, and you completely turned it around.',
        hostExpression: 'delighted',
        guestExpression: 'neutral',
      },
    ],
    choices: {
      host: [
        {
          id: 'h_deep_dream',
          label: 'Ask what childhood dream they still secretly hold onto',
          description: 'Ask about the creative or wild passion they held before adult responsibilities took over.',
          foreseenRisk: 'Could bring up sentimental or bittersweet memories.',
        },
        {
          id: 'h_deep_honest',
          label: 'Admit: "I haven\'t felt this close to someone in years"',
          description: 'Put your cards on the table with unfiltered sincerity.',
          foreseenRisk: 'Vulnerability leaves you emotionally exposed across the screen.',
        },
      ],
      guest: [
        {
          id: 'g_deep_story',
          label: 'Share a story about taking a big life risk that shaped you',
          description: 'Tell the personal turning point story that defined who you are today.',
          foreseenRisk: 'Takes courage to tell someone you have only known virtually.',
        },
        {
          id: 'g_deep_spark',
          label: 'Tell them the exact moment on call one that made you fall for them',
          description: 'Recall the specific phrase or laugh from the first call that gave you butterflies.',
          foreseenRisk: 'Confirms your feelings explicitly.',
        },
      ],
    },
  },

  {
    id: 'scene_3_2',
    chapterNumber: 3,
    chapterTitle: 'Night Three: The Late Night Deep Conversation',
    sceneNumber: 2,
    totalScenesInChapter: 2,
    title: 'The Great Pillow Collapse & The Stale Hang-Up',
    settingName: 'Wednesday Morning · 2:00 AM · The Bedside Slump',
    backgroundVariant: 'split_date',
    continuity: 'Having poured your hearts out, both of you are lying on pillows, phones propped against blankets.',
    immediateGoal: 'Say goodnight without either person wanting to be the one to break the connection.',
    stakes: 'You both have alarms set for 7:00 AM for work tomorrow.',
    decisionPrompt: 'How do you finally resolve the "you hang up first" dilemma?',
    dialogue: [
      {
        id: 'd8_1',
        speaker: 'narrator',
        text: '*THUMP.* Host\'s phone slips off the pillow, tumbling face-first into the duvet with muffled groans.',
      },
      {
        id: 'd8_2',
        speaker: 'guest',
        text: 'Are you alive?! That sounded like your phone took a swan dive off a skyscraper!',
        hostExpression: 'laughing',
        guestExpression: 'laughing',
      },
      {
        id: 'd8_3',
        speaker: 'host',
        text: 'I am okay! Just suffocated by a down pillow. Okay, it is 2:00 AM. We genuinely need to sleep.',
        hostExpression: 'embarrassed',
        guestExpression: 'delighted',
      },
    ],
    choices: {
      host: [
        {
          id: 'h_drop_sleep',
          label: 'Offer a 3-2-1 synchronized disconnect countdown',
          description: 'Propose counting down from three so neither person has the guilt of hanging up first.',
          foreseenRisk: 'Someone will definitely hesitate on "one."',
        },
        {
          id: 'h_drop_keep',
          label: 'Whisper: "Just leave the audio on while we fall asleep"',
          description: 'Keep the quiet connection open as ambient white noise until morning.',
          foreseenRisk: 'Your phone battery might completely drain overnight.',
        },
      ],
      guest: [
        {
          id: 'g_drop_one',
          label: 'Blatantly refuse to disconnect on "one" and laugh',
          description: 'Let the countdown reach zero and stay on the line just to catch them cheating too.',
          foreseenRisk: 'Extends the call another twenty minutes.',
        },
        {
          id: 'g_drop_morning',
          label: 'Demand a "good morning" voice memo before your 8:00 AM coffee',
          description: 'Lock in the first interaction of tomorrow before hanging up tonight.',
          foreseenRisk: 'You have to sound charming before coffee tomorrow.',
        },
      ],
    },
  },

  // =========================================================================
  // CHAPTER 4: Night Four — Bridging The Distance (The In-Person Leap)
  // =========================================================================
  {
    id: 'scene_4_1',
    chapterNumber: 4,
    chapterTitle: 'Night Four: Bridging The Distance',
    sceneNumber: 1,
    totalScenesInChapter: 2,
    title: 'The Real-Life Ticket Booking',
    settingName: 'Sunday Afternoon · 3:00 PM · The Final Decision',
    backgroundVariant: 'split_date',
    continuity: 'After four unforgettable virtual dates, the webcams are no longer enough. The distance needs to be closed.',
    immediateGoal: 'Coordinate your real-world schedules and lock in your first in-person meeting.',
    stakes: 'Hesitation leaves things in virtual limbo; taking the leap changes everything forever.',
    decisionPrompt: 'How will you bridge the physical distance between you?',
    dialogue: [
      {
        id: 'd10_1',
        speaker: 'narrator',
        text: 'Both of you have flight and train booking windows open side-by-side with your video call.',
      },
      {
        id: 'd10_2',
        speaker: 'host',
        text: 'I am looking at train tickets for next weekend. Are we crazy, or is this the best decision we have made all year?',
        hostExpression: 'determined',
        guestExpression: 'delighted',
      },
      {
        id: 'd10_3',
        speaker: 'guest',
        text: 'Definitely crazy, and 100% the best decision. I already found a direct route that arrives Friday at 6:00 PM.',
        hostExpression: 'delighted',
        guestExpression: 'determined',
      },
    ],
    choices: {
      host: [
        {
          id: 'h_travel_book',
          label: 'Click "Confirm Booking" live on camera together',
          description: 'Hover your finger over the purchase button and click simultaneously.',
          foreseenRisk: 'Non-refundable tickets lock the date in stone.',
        },
        {
          id: 'h_travel_halfway',
          label: 'Propose meeting halfway at a scenic cabin retreat',
          description: 'Meet at a halfway road-trip destination for an adventurous neutral-ground date.',
          foreseenRisk: 'Requires both of you to navigate unfamiliar travel routes.',
        },
      ],
      guest: [
        {
          id: 'g_travel_confirmed',
          label: 'Hold up your confirmation screen with a huge grin',
          description: 'Lock in your seat and celebrate the official countdown.',
          foreseenRisk: 'Butterflies will now inhabit your stomach for the next 7 days.',
        },
        {
          id: 'g_travel_itinerary',
          label: 'Draft a goofy 3-page "Zero Stiff Etiquette" date itinerary',
          description: 'Include required dumpling stops, bad movie marathons, and a strict no-fancy-shoes rule.',
          foreseenRisk: 'Leaves no room for boring standard date activities.',
        },
      ],
    },
  },

  {
    id: 'scene_4_2',
    chapterNumber: 4,
    chapterTitle: 'Night Four: Bridging The Distance',
    sceneNumber: 2,
    totalScenesInChapter: 2,
    title: 'The Final Webcam Pledge',
    settingName: 'Sunday Afternoon · 4:00 PM · See You Next Week',
    backgroundVariant: 'rooftop_glow',
    continuity: 'The tickets are purchased. The countdown has officially begun. You are about to sign off your last virtual-only date.',
    immediateGoal: 'Seal your real-world pact and celebrate the wild, hilarious journey that brought you here.',
    stakes: 'This is the conclusion of your virtual romance and the beginning of your real-world adventure.',
    decisionPrompt: 'What is your final pledge before logging off to meet in person?',
    dialogue: [
      {
        id: 'd11_1',
        speaker: 'narrator',
        text: 'The late afternoon sun paints both of your rooms in golden light. The webcam frames that once separated you now feel like a cozy shared history.',
      },
      {
        id: 'd11_2',
        speaker: 'host',
        text: 'Next time I see you, there will not be a glass screen between us. Just real life, real hugs, and no lag.',
        hostExpression: 'delighted',
        guestExpression: 'delighted',
      },
      {
        id: 'd11_3',
        speaker: 'guest',
        text: 'I cannot wait. Safe travels, partner in chaos. See you on the other side of the screen.',
        hostExpression: 'delighted',
        guestExpression: 'delighted',
      },
    ],
    choices: {
      host: [
        {
          id: 'h_final_hug',
          label: 'Pledge: "First thing at the gate is a 30-second long hug"',
          description: 'Promise that neither of you will settle for an awkward polite handshake.',
          foreseenRisk: 'Public PDA in front of tired airport travelers.',
        },
        {
          id: 'h_final_legend',
          label: 'Pledge: "We never forget the soy sauce and buzzer chaos"',
          description: 'Vow to frame the original dumpling menu as the foundation of your love story.',
          foreseenRisk: 'Your future apartment decor will feature takeout memorabilia.',
        },
      ],
      guest: [
        {
          id: 'g_final_kiss',
          label: 'Blow a kiss directly into the webcam and slam the laptop shut',
          description: 'Dramatic rom-com movie ending exit with flair and conviction.',
          foreseenRisk: 'Might accidentally shake the camera loose on its hinges.',
        },
        {
          id: 'g_final_toast',
          label: 'Raise one final tap-water cartoon mug toast to the future',
          description: 'End exactly how you started, but with everything having changed.',
          foreseenRisk: 'Spilling tap water on the goodbye smile.',
        },
      ],
    },
  },
];

/**
 * Calculates a complete shared outcome scene with concrete character actions,
 * immediate results, tangible consequences, and situation state deltas.
 */
export function getCombinedConsequence(
  sceneId: string,
  hostChoiceId: string,
  guestChoiceId: string,
  hostName: string = 'Host',
  guestName: string = 'Partner'
): CombinedConsequence {
  // =========================================================================
  // SCENE 1.1: The Intercom Buzzer & Takeout Delivery
  // Demonstrates:
  // 1) At least one agreement that backfires (h_door_sprint + g_door_call)
  // 2) At least one disagreement that produces a useful result (h_door_intercom + g_door_call)
  // =========================================================================
  if (sceneId === 'scene_1_1') {
    // 1. AGREEMENT THAT BACKFIRES: Both rushed in coordinated panic
    if (hostChoiceId === 'h_door_sprint' && guestChoiceId === 'g_door_call') {
      return {
        title: 'The Stairwell Lockout Catastrophe',
        description: `Coordinated panic backfired spectacularly! While ${hostName} bolted down three flights of stairs in fuzzy slippers without keys, ${guestName} simultaneously called the courier and gave frantic directions to the rear alley fire escape! The heavy stairwell spring-latch slammed shut behind ${hostName}, locking them in the chilly lobby hallway with no phone. Meanwhile, the courier dumped the takeout bags outside in the drizzle at the rear gate. Mr. Henderson swung open apartment 3B in his bathrobe to yell about the running, and ${hostName} had to spend eight embarrassing minutes picking the hallway latch with an old hairpin while the food grew cold!`,
        hostActionTaken: `${hostName} sprinted downstairs in slippers to intercept the driver face-to-face.`,
        guestActionTaken: `${guestName} called the courier directly and redirected them to the rear alley gate.`,
        immediateResult: `Host was locked in the lobby stairwell without keys while the courier abandoned dinner at the wrong gate in the rain.`,
        agreementType: 'backfired_agreement',
        tangibleChanges: [
          'Lost 12 minutes of date preparation time',
          'Host was locked in the stairwell in slippers for 8 minutes',
          'Takeout recovered cold and damp from the back alley gate',
          'Mr. Henderson (3B) is irritated by hallway shouting and slammed his door',
        ],
        stateChanges: [
          {
            field: 'timeRemaining',
            change: 'Reduced to 13 minutes remaining',
            reason: '8 minutes spent picking the lobby stairwell latch',
          },
          {
            field: 'helperStatus',
            change: 'Mr. Henderson: Thoroughly irritated',
            reason: 'Disturbed his Friday night poker tournament with hallway sprint yelling',
          },
          {
            field: 'deliveryStatus',
            change: 'Takeout: Recovered cold & damp from back gate',
            reason: 'Left in the rain for 8 minutes before retrieval',
          },
          {
            field: 'activeComplication',
            change: 'Host has soaked socks and a picked door latch',
            reason: 'Lockout mishap in the hallway',
          },
        ],
        hostReaction: 'panicked',
        guestReaction: 'embarrassed',
        comicBonus: '⚠️ Coordinated Panic Penalty (-12 mins prep)',
      };
    }

    // 2. DISAGREEMENT THAT PRODUCES A USEFUL RESULT: Uncoordinated approaches accidentally complement each other
    if (hostChoiceId === 'h_door_intercom' && guestChoiceId === 'g_door_call') {
      return {
        title: 'The Accidental Double-Flank Victory',
        description: `Two completely opposite ideas accidentally produced a masterclass in teamwork! While ${hostName} courteously rang apartment 3B to apologize and ask for gate assistance, ${guestName} stayed on the phone with the lost courier, feeding them exact street landmarks. Mr. Henderson was so touched by ${hostName}'s polite tone that he stepped outside in his velvet slippers with building security keys, met the courier right as ${guestName} guided them to the curb, and carried the steaming food up to ${hostName}'s door with a proud smile!`,
        hostActionTaken: `${hostName} called neighbor Henderson on the intercom to politely negotiate building access.`,
        guestActionTaken: `${guestName} called the courier cell and gave pinpoint street landmarks.`,
        immediateResult: `Henderson held the security gate open while Guest guided the courier directly to him. Dinner arrived steaming hot with zero prep time lost!`,
        agreementType: 'accidental_harmony',
        tangibleChanges: [
          'Zero preparation time lost (25 minutes still remaining)',
          'Dinner delivered steaming hot and unspilled',
          'Mr. Henderson is now a smiling building ally who offered spare dessert',
          'The courier gave a 5-star customer rating for clear street guidance',
        ],
        stateChanges: [
          {
            field: 'timeRemaining',
            change: '25 minutes remaining (Flawless schedule)',
            reason: 'Courier escorted directly to apartment door without delay',
          },
          {
            field: 'helperStatus',
            change: 'Mr. Henderson: Friendly Ally · Holding building gate pass',
            reason: 'Appreciated polite communication instead of random buzzer noise',
          },
          {
            field: 'deliveryStatus',
            change: 'Takeout: Delivered piping hot & intact',
            reason: 'Handed directly to Henderson at the security gate',
          },
          {
            field: 'activeComplication',
            change: 'None — Smooth sailing',
            reason: 'Clean team resolution',
          },
        ],
        hostReaction: 'delighted',
        guestReaction: 'delighted',
        comicBonus: '✨ Accidental Synergy Bonus (Friendly Neighbor Ally)',
      };
    }

    // 3. Double Order / Backup Dumpings
    if (guestChoiceId === 'g_door_backup') {
      return {
        title: 'The Great Dumpling Surplus',
        description: `While ${hostName} negotiated with the front door, ${guestName} quietly placed an emergency backup order. Within twenty minutes, TWO separate delivery drivers were standing in the hallway offering bags of fried dumplings! You now possess enough food for a small wedding banquet.`,
        hostActionTaken: `${hostName} managed the front door buzzer situation.`,
        guestActionTaken: `${guestName} placed a panic backup takeout order to prevent starvation.`,
        immediateResult: `Dinner was doubled. You both now have 40 dumplings and an extra $24 spent on expedited delivery.`,
        agreementType: 'comic_mismatch',
        tangibleChanges: [
          'Lost 6 minutes organizing double food delivery',
          'Spent an extra $24 on emergency backup food',
          'Recovered enough dumplings to feed the entire apartment floor',
        ],
        stateChanges: [
          {
            field: 'timeRemaining',
            change: '19 minutes remaining',
            reason: 'Time spent sorting through two delivery bags',
          },
          {
            field: 'deliveryStatus',
            change: 'Takeout: Massive surplus (40 dumplings)',
            reason: 'Both orders arrived successfully',
          },
        ],
        hostReaction: 'laughing',
        guestReaction: 'delighted',
        comicBonus: '🥟 Dumpling Hoarder Achievement',
      };
    }

    // Default fallback for Scene 1.1
    return {
      title: 'The Hallway Peace Settlement',
      description: `${hostName} leaned out the door while ${guestName} provided live webcam surveillance. The driver handed over the bag with a bewildered chuckle, and the immediate crisis was averted with only minor hallway echo.`,
      hostActionTaken: `${hostName} communicated with the driver through the hallway threshold.`,
      guestActionTaken: `${guestName} tracked delivery status and provided moral support.`,
      immediateResult: `Food was recovered warm. Mr. Henderson gave a stern grunt from 3B but returned to his poker game.`,
      agreementType: 'harmony',
      tangibleChanges: [
        'Lost 4 minutes to buzzer negotiation',
        'Dinner recovered warm and mostly intact',
        'Mr. Henderson is watching cautiously from apartment 3B',
      ],
      stateChanges: [
        {
          field: 'timeRemaining',
          change: '21 minutes remaining',
          reason: 'Buzzer resolved with minor delay',
        },
        {
          field: 'helperStatus',
          change: 'Mr. Henderson: Neutral / Wary',
          reason: 'Buzzer ceased before he filed a complaint',
        },
      ],
      hostReaction: 'delighted',
      guestReaction: 'delighted',
      comicBonus: '+10 Diplomatic Resolve',
    };
  }

  // =========================================================================
  // SCENE 1.2: The Soy Sauce Spill & Corporate Webinar (Linked Cost!)
  // =========================================================================
  if (sceneId === 'scene_1_2') {
    // Executive Bluff + Force Quit: Hilarious triumph
    if (hostChoiceId === 'h_sauce_bluff' && guestChoiceId === 'g_sauce_forcequit') {
      return {
        title: 'The Agile Strategy Executive Bluff',
        description: `Pure improvisational genius! Just before ${guestName} smashed Command-Q to terminate the company call, ${hostName} leaned toward the microphone and projected in a booming corporate voice: "We are simply stress-testing our cross-functional agile bandwidth through rapid response simulations!" The VP of Product actually nodded thoughtfully on screen before the call cut out, convinced ${guestName} was working late with an elite management consultant!`,
        hostActionTaken: `${hostName} improvised executive buzzwords to cover for the unmuted conference call.`,
        guestActionTaken: `${guestName} force-quit the work application before attendance was recorded.`,
        immediateResult: `The corporate conference was severed with zero professional damage. The VP believed it was a strategy session.`,
        agreementType: 'accidental_harmony',
        tangibleChanges: [
          'Saved Guest from corporate HR reprimand',
          'Lost 5 minutes cleaning soy sauce off keyboard spacebar',
          'Barnaby was distracted by the executive speech and fell asleep on the rug',
        ],
        stateChanges: [
          {
            field: 'timeRemaining',
            change: '14 minutes remaining',
            reason: 'Spent 5 minutes dabbing spacebar with napkins',
          },
          {
            field: 'activeComplication',
            change: 'Spacebar has slight soy sauce stickiness; webcam has cozy sepia hue',
            reason: 'Quick cleanup saved circuits from frying',
          },
        ],
        hostReaction: 'laughing',
        guestReaction: 'laughing',
        comicBonus: '💼 Corporate Impostor Mastery (+20 Charisma)',
      };
    }

    // Napkin Wipe + Mic Guide: Technical rescue
    if (hostChoiceId === 'h_sauce_wipe' || guestChoiceId === 'g_sauce_guide') {
      return {
        title: 'The Methodical Hardware Rescue',
        description: `${hostName} ripped out the keyboard cable and absorbed the soy sauce puddle with a cloth napkin, while ${guestName} swiftly muted the rogue work meeting with an audio hotkey. Working together like trauma surgeons over a video call, the keyboard was saved with only minor sticky residue on the spacebar!`,
        hostActionTaken: `${hostName} blotted the liquid immediately and unplugged the keyboard power.`,
        guestActionTaken: `${guestName} muted the microphone and coached Host through circuit drying.`,
        immediateResult: `Electronics survived unharmed. The work call heard only two seconds of muffled rustling.`,
        agreementType: 'harmony',
        tangibleChanges: [
          'Lost 6 minutes to methodical hardware cleanup',
          'Keyboard saved from fatal short-circuit',
          'Barnaby coaxed gently away from the power strip',
        ],
        stateChanges: [
          {
            field: 'timeRemaining',
            change: '13 minutes remaining',
            reason: 'Detailed electronics triage and cloth blotting',
          },
          {
            field: 'activeComplication',
            change: 'Desk is clean; single damp napkin on coaster',
            reason: 'Hardware safely secured',
          },
        ],
        hostReaction: 'delighted',
        guestReaction: 'delighted',
        comicBonus: '🛠️ Tech Support Synergy (+15 Competence)',
      };
    }

    // Default for 1.2
    return {
      title: 'The Dumpling Truce with Barnaby',
      description: `${hostName} tossed a dumpling crust into the corner, and Barnaby bounded happily after it, forgetting all about the live wires. Meanwhile, ${guestName} killed the conference audio and wiped their camera with a sleeve. Chaos was tamed just in time!`,
      hostActionTaken: `${hostName} negotiated with Barnaby using food bribes.`,
      guestActionTaken: `${guestName} suppressed the corporate conference call audio.`,
      immediateResult: `Hardware safe, dog pacified, work meeting successfully evaded.`,
      agreementType: 'harmony',
      tangibleChanges: [
        'Lost 4 minutes to dog bribery and camera cleaning',
        'Barnaby is now a permanent fixture at Host\'s feet',
      ],
      stateChanges: [
        {
          field: 'timeRemaining',
          change: '15 minutes remaining',
          reason: 'Swift multi-tasking prevented major downtime',
        },
      ],
      hostReaction: 'delighted',
      guestReaction: 'delighted',
      comicBonus: '🐾 Canine Neutrality Established',
    };
  }

  // =========================================================================
  // SCENE 1.3: The Front-Door Knock & Henderson's Callback (Linked Climax!)
  // =========================================================================
  if (sceneId === 'scene_1_3') {
    return {
      title: 'Mr. Henderson\'s Cannoli Blessing',
      description: `${hostName} opened the door holding the laptop so ${guestName} could wave directly at Mr. Henderson. When Henderson saw the two of you laughing together in fuzzy hoodies, his gruff demeanor melted completely. He produced a white bakery box with three fresh raspberry cannoli from his poker break, tipped his baseball cap to ${guestName} on the webcam, and said: "Finally, a couple with some personality in this building. Keep the dog—he\'s quiet compared to my poker buddies." The date ended in total triumph!`,
      hostActionTaken: `${hostName} opened the door with transparency and introduced their video date directly.`,
      guestActionTaken: `${guestName} offered a warm, charismatic hello to Henderson across the webcam.`,
      immediateResult: `Mr. Henderson blessed the date with fresh Italian pastries and officially approved of Barnaby the dog!`,
      agreementType: 'wild_synergy',
      tangibleChanges: [
        'Gained 3 fresh raspberry cannoli from neighbor Henderson',
        'Permanent building noise immunity granted for future virtual dates',
        'Date Night #1 concluded with a shared dessert and zero lingering tension',
      ],
      stateChanges: [
        {
          field: 'helperStatus',
          change: 'Mr. Henderson: Lifelong Building Patron & Fan',
          reason: 'Charmed by the webcam couple and pleased by their authenticity',
        },
        {
          field: 'deliveryStatus',
          change: 'Takeout: Fully consumed + bonus cannoli dessert',
          reason: 'Mission completed with bonus bakery sweets',
        },
        {
          field: 'activeComplication',
          change: 'None — Absolute triumph',
          reason: 'All obstacles resolved with flying colors',
        },
      ],
      hostReaction: 'delighted',
      guestReaction: 'delighted',
      comicBonus: '👑 Legendary Rom-Com Finish (+50 Cannoli Power)',
    };
  }

  // =========================================================================
  // SCENE 2.1: The Movie Sync
  // =========================================================================
  if (sceneId === 'scene_2_1') {
    if (hostChoiceId === 'h_sync_ditch' || guestChoiceId === 'g_sync_talk') {
      return {
        title: 'The Movie That Never Happened',
        description: `After laughing through three failed countdown attempts, ${hostName} and ${guestName} agreed: the movie was just a polite pretext anyway. You closed the browser streaming tab, pulled your mugs closer, and spent the next three hours talking about childhood nicknames, weird airport habits, and secret dreams.`,
        hostActionTaken: `${hostName} proposed closing the movie tab in favor of direct conversation.`,
        guestActionTaken: `${guestName} enthusiastically agreed and closed their streaming window.`,
        immediateResult: `The movie was skipped entirely, leading to your deepest and most natural conversation yet.`,
        agreementType: 'harmony',
        tangibleChanges: [
          'Saved 90 minutes of passive movie watching',
          'Unlocked three hours of genuine laughter and storytelling',
        ],
        hostReaction: 'delighted',
        guestReaction: 'delighted',
        comicBonus: '+20 Prioritizing Each Other',
      };
    }
    return {
      title: 'The 5-Second Spoiler Laugh',
      description: `${hostName} burst into laughter five seconds before the punchline landed on ${guestName}'s screen. Trying to coordinate the playback ended up being ten times funnier than the actual movie.`,
      hostActionTaken: `${hostName} followed the countdown while living 5 seconds in the video future.`,
      guestActionTaken: `${guestName} embraced the lag and predicted plot points from Host's giggles.`,
      immediateResult: `The movie was hopelessly out of sync, but the commentary was pure comedy gold.`,
      agreementType: 'comic_mismatch',
      tangibleChanges: [
        'Created a running joke about time-traveling laughter',
      ],
      hostReaction: 'laughing',
      guestReaction: 'laughing',
      comicBonus: '+15 Asynchronous Joy',
    };
  }

  // =========================================================================
  // SCENE 2.2: Screen Share
  // =========================================================================
  if (sceneId === 'scene_2_2') {
    return {
      title: 'The Pre-Date Playlist Confession',
      description: `The accidental desktop share revealed ${hostName}'s secret playlist called "Pre-Date Panic Jams." Instead of being embarrassed, ${guestName} knew all the lyrics to track three. You sang a full duet across the webcam using pens as microphones!`,
      hostActionTaken: `${hostName} owned the embarrassment and belted out the chorus.`,
      guestActionTaken: `${guestName} joined in as backup singer with zero judgment.`,
      immediateResult: `Vulnerability turned an awkward blunder into a peak memory.`,
      agreementType: 'wild_synergy',
      tangibleChanges: [
        'Created a shared Spotify collaborative playlist',
        'Zero self-consciousness remaining between the two of you',
      ],
      hostReaction: 'delighted',
      guestReaction: 'delighted',
      comicBonus: '+25 Vocal Harmonies',
    };
  }

  // =========================================================================
  // SCENE 3.1: Midnight Frequency
  // =========================================================================
  if (sceneId === 'scene_3_1') {
    return {
      title: 'The Quiet Midnight Harbor',
      description: `In the quiet between 1:00 AM and 2:00 AM, the walls came down completely. ${hostName} and ${guestName} shared things they had kept hidden from the world. A rare, grounding sense of safety filled both bedrooms.`,
      hostActionTaken: `${hostName} opened up with authentic sincerity.`,
      guestActionTaken: `${guestName} met that vulnerability with warmth and deep listening.`,
      immediateResult: `Distance stopped feeling like a barrier and started feeling like a temporary delay.`,
      agreementType: 'harmony',
      tangibleChanges: [
        'Shifted from casual dating to genuine emotional commitment',
      ],
      hostReaction: 'delighted',
      guestReaction: 'delighted',
      comicBonus: '+30 Soulful Connection',
    };
  }

  // =========================================================================
  // SCENE 3.2: The Pillow Collapse
  // =========================================================================
  if (sceneId === 'scene_3_2') {
    return {
      title: 'The 2:00 AM Standstill',
      description: `Neither of you wanted to hang up. When the countdown reached "one," both of you were still smiling on screen, catching each other in the exact same lie. You finally drifted off with the quiet promise of a morning text.`,
      hostActionTaken: `${hostName} laughed from under the pillow and stalled the disconnect.`,
      guestActionTaken: `${guestName} refused to hang up first.`,
      immediateResult: `The mutual reluctance to end the call confirmed what both of you already felt.`,
      agreementType: 'harmony',
      tangibleChanges: [
        'Locked in mandatory morning voice memo ritual',
      ],
      hostReaction: 'delighted',
      guestReaction: 'delighted',
      comicBonus: '+25 Butterflies Confirmed',
    };
  }

  // =========================================================================
  // SCENE 4.1: The In-Person Leap
  // =========================================================================
  if (sceneId === 'scene_4_1') {
    return {
      title: 'The Real-Life Travel Confirmation',
      description: `With a deep breath and a countdown, ${hostName} and ${guestName} clicked purchase at the exact same moment. The confirmation screen appeared with green checkmarks. The webcams will officially be retired next weekend!`,
      hostActionTaken: `${hostName} confirmed travel arrangements.`,
      guestActionTaken: `${guestName} locked in their schedule and saved the arrival countdown.`,
      immediateResult: `The leap from digital to physical was made with full mutual enthusiasm.`,
      agreementType: 'harmony',
      tangibleChanges: [
        'Train tickets booked for Friday 6:00 PM arrival',
        'Official 7-day countdown started',
      ],
      hostReaction: 'delighted',
      guestReaction: 'delighted',
      comicBonus: '+50 Distance Bridged',
    };
  }

  // =========================================================================
  // SCENE 4.2: Final Pledge
  // =========================================================================
  return {
    title: 'The In-Person Pact',
    description: `With a shared laugh and a heartfelt promise, ${hostName} and ${guestName} made their final pledge: long hugs at the gate, zero pretense, and framing the takeout menu as proof that love can survive any digital glitch.`,
    hostActionTaken: `${hostName} delivered the final pledge with a wide smile.`,
    guestActionTaken: `${guestName} raised a toast and blew a kiss before shutting the laptop.`,
    immediateResult: `The virtual chapter ends, and the real-world story officially begins.`,
    agreementType: 'harmony',
    tangibleChanges: [
      'Pledged to meet at the arrivals gate with no awkward handshakes',
      'The Great Date Glitch successfully conquered',
    ],
    hostReaction: 'delighted',
    guestReaction: 'delighted',
    comicBonus: '+100 Real Life Beginning',
  };
}

/**
 * Recaps between chapters.
 */
export const CHAPTER_RECAPS: Record<number, ChapterRecap> = {
  1: {
    chapterNumber: 1,
    chapterTitle: 'Night One: The Delivery Dilemma & Building Chaos',
    bulletPoints: [
      'Surviving the aggressive intercom buzzer and courier delivery mix-up.',
      'A rogue soy sauce explosion met with fast reflexes and a corporate executive bluff.',
      'Neighbor Mr. Henderson blessed the date with fresh raspberry cannoli and canine approval.',
    ],
    funnyHighlight: 'Realizing that surviving chaotic building politics together is ten times more romantic than a stiff candlelit dinner.',
  },
  2: {
    chapterNumber: 2,
    chapterTitle: 'Night Two: The Watch-Party & Quirks',
    bulletPoints: [
      'Attempted to sync movie countdowns, got five seconds out of sync, and decided talking was better anyway.',
      'An accidental screen share revealed a secret playlist that turned into an endearing karaoke duet.',
      'Trading eccentric habits and quirks proved that your weirdness fits together seamlessly.',
    ],
    funnyHighlight: 'Discovering that what you thought was an embarrassing habit is actually each other\'s favorite thing.',
  },
  3: {
    chapterNumber: 3,
    chapterTitle: 'Night Three: The 1:00 AM Deep Talk',
    bulletPoints: [
      'A "quick fifteen-minute check-in" drifted past 1:00 AM in cozy oversized hoodies.',
      'The great phone pillow drop triggered a silent, breathless fit of late-night laughter.',
      'The lingering "you hang up first" dilemma confirmed that genuine love had taken root.',
    ],
    funnyHighlight: 'Forgetting that you have work early tomorrow morning because staying on the line felt too good to leave.',
  },
};

/**
 * Endings based on player choices and chemistry.
 */
export const STORY_ENDINGS: StoryEnding[] = [
  {
    id: 'ending_spontaneous',
    title: 'The Spontaneous Leap',
    subtitle: 'From Screen to Reality in 7 Days',
    badge: 'Undeniable Chemistry',
    narrative:
      'What began with an awkward intercom buzzer and a soy sauce mishap has evolved into something genuinely special. The travel confirmations are saved in both of your inboxes. In just one week, you will be meeting at the arrivals gate with a long-overdue hug and no webcams between you.',
    chaosLevel: 'Delightful & Grounded',
    signatureMoment: 'The midnight phone drop into the pillows and the cannoli peace offering',
    runningJokes: [
      'Barnaby\'s official seal of approval',
      'The 5-second movie spoiler laugh',
      'Executive buzzwords during the soy sauce crisis',
    ],
  },
  {
    id: 'ending_cozy',
    title: 'The Cozy Storybook Couple',
    subtitle: 'Built on Honesty, Laughter & Late Nights',
    badge: 'Soulful Connection',
    narrative:
      'Through hoodie check-ins, confessions of pre-date nervousness, and sharing things you rarely tell anyone, you built a foundation of trust that distance could not diminish. The first in-person date is mapped out, and both of you know this is just the opening chapter of a much bigger story.',
    chaosLevel: 'Warm & Authentic',
    signatureMoment: 'Trading embarrassing playlists with zero judgment',
    runningJokes: [
      'Tap water toast in cartoon mugs',
      'Ballpoint pen chopsticks',
      'The 3-2-1 hang-up stalemate',
    ],
  },
  {
    id: 'ending_adventurous',
    title: 'The Halfway Road-Trip Partners',
    subtitle: 'Meeting in the Middle for the Ultimate Adventure',
    badge: 'Dynamic Duo',
    narrative:
      'Neither of you took the conventional route. You met each other halfway in both conversation and geography. With bags packed and a weekend destination locked in, the inside jokes and laughter that started in separate rooms are about to take over the real world.',
    chaosLevel: 'High Energy & Charming',
    signatureMoment: 'The spontaneous decision to meet halfway',
    runningJokes: [
      'Airport gate vs TSA sprint debate',
      'Neon-red mystery sauce courage',
      'The webcam clink resonance',
    ],
  },
];

export function calculateEnding(choiceHistory: Array<{ sceneId?: string; hostChoiceId: string; guestChoiceId: string }>): StoryEnding {
  const allChoices = choiceHistory.flatMap((c) => [c.hostChoiceId, c.guestChoiceId]);

  if (allChoices.some((id) => id.includes('halfway') || id.includes('adventure'))) {
    return STORY_ENDINGS[2]; // Adventurous
  }
  if (allChoices.some((id) => id.includes('deep') || id.includes('honest') || id.includes('comfort'))) {
    return STORY_ENDINGS[1]; // Cozy
  }
  return STORY_ENDINGS[0]; // Spontaneous
}

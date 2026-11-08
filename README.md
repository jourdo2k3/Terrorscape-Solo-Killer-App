# Terrorscape Solo Killer

A web app that plays the **killer** in the board game *Terrorscape* (Ice Makes, 2023), so you can play solo as the three survivors.

**Play it:** https://jourdo2k3.github.io/Terrorscape-Solo-Killer-App/

**Current version:** v2.6

The app sits "behind the screen." It holds the killer's deck and hand, decides his moves, and asks you only what the real rules make survivors reveal. You play the survivors on your physical board, and the app tells you where the killer goes and what he does.

## What it supports right now
- **Map:** The Mansion. The Cabin, Laboratory, Castle and Tomb are shown on the setup screen as coming later.
- **Killer:** The Butcher. The rulebook recommends him for a first game. The Murderer and the Spectre are shown as in progress.
- **Survivors:** all 9 (Anna, Caleb, Dylan, George, Johnson, Marco, Ophelia, Sophia, William), with their special abilities taken into account
- **Killer traits:** all 20, used by the killer when traits are turned on
- **Two killer skill levels:** Tutorial and Normal, for games without traits
- **Fear and health tracking** for each survivor, including fear removal, healing and Ophelia's Encouragement token
- **Rescue countdown** once the radio is repaired

## How a game works
1. **Setup.** Pick the map and the killer (the Mansion and the Butcher for now), then your 3 survivors. Then turn traits on or off:
   - **Traits off:** choose the killer's difficulty, Tutorial or Normal.
   - **Traits on:** choose one of the rulebook's trait levels (Easy, Normal, Hard or Nightmare).

   Start the game, and the app tells you where the Butcher starts and which traits he has.
2. **Your turn (survivors).** Play your turn at the table as normal. Then tell the app only what the rules say the killer learns:
   1. **Noise:** click the rooms with noise tokens on the map. If a Firecracker went off, tick the box instead: the killer then learns nothing from noise that turn.
   2. **Block tokens** you removed.
   3. **Public info:** keys on the key stand, and whether the radio is repaired.
   4. **Fear and health:** if anyone removed fear (Remove all fear, a Tranquilizer, Encouraging Words) or was healed, click their box in the top bar. The fear boxes lower their fear; clicking HURT flips it back to OK. You never say *how* it happened, only that it did.
3. **The killer's turn.** The app plays the Butcher's turn and tells you what to do on the board: move his miniature, place blocks, and so on. When he uses [SEARCH] or [SENSE], answer honestly. When he gives fear, confirm who took it, who was overwhelmed (the app pre-fills this from its own count), or who cancelled it with an Encouragement token. Encounters are resolved at the table with real dice, and the app just asks whether the attack was repelled or someone was injured.
4. Repeat until someone wins.

### How the game ends
- **The killer wins** automatically when a survivor is eliminated.
- **Rescue:** when you tick "the radio is repaired", the app places the rescue token on 5, counts it down at the start of each of your turns, and declares the survivors' win when rescue arrives. You can adjust the count with − / + if it ever gets out of step with your board.
- **Escape:** once all 5 keys are on the stand, a **We escaped!** button appears at the start of your turn, with a confirmation.
- **Anything else** (for example the Discover deck running out): use **End game…** at the bottom of your turn panel.

Your game saves automatically in your browser, so you can close the page and resume later. There's also an **Undo** button for mistakes.

## The game screen
- **Top bar:** the round, a box for each survivor (OK / HURT and their fear: 1, 2, and the noise token a 3rd fear would cause), the rescue countdown once it's running, and the ⚙ menu.
- **Left:** the map, which stays in place while you scroll, with the **killer box** underneath: his level, strength, encounter strength when a card has raised it for the turn, whether he's in stealth, and a mini-log of his last turn.
- **Right:** your turn panel, the killer's traits (when he has any) and the full log.

On a phone everything stacks into one column.

## How the killer thinks
The killer never sees where you are. He works it out the same way a human killer would.

- **Guessing where you are.** The app tracks how likely every possible combination of survivor locations is. After each of your turns it considers where each survivor could have moved, and it accounts for block tokens, secret passages and each character's abilities. It updates the odds from what you report:
  - **Noise** makes nearby rooms more likely, and **silence** makes the usual hiding spots (search rooms, the radio) less likely.
  - **Decoys** are accounted for. A Whiskey Bottle, Sophia's Camera or George's Note can make noise where nobody is.
  - **Honest answers** to [SEARCH], [SENSE] and fear are treated as certain. Anna is invisible to [SENSE], so her not being named tells him nothing.
  - **Fear and health changes** (Normal killer only). He only sees that fear came off or someone was healed, never how, so he weighs the likely causes. Fear removed might mean that survivor spent their action and stayed put, or that they used a hidden Tranquilizer (more likely as the game goes on), or that Ophelia used Encouraging Words. A heal suggests a teammate was in the same room, and that the healer stayed there; Herbal Medicine also makes noise in that room.
- **Choosing a plan.** Each turn he picks what fits best: Revving Chainsaw when someone is likely within reach, a direct search when he's fairly sure of a room, Brutal Rage when it's worth the gamble, or a hunt toward the most likely area. He also blocks doors, guards the radio when repairs look advanced, and gets more aggressive once a rescue is called or all 5 keys are found.

## Difficulty
There are two settings.

### Traits: Off or On
- **Off** is the vanilla game: no traits on either side.
- **On** uses the rulebook's Trait variant (p.27), unchanged:

| Level | Survivors | Killer |
|---|---|---|
| Easy | each draws 2 traits, keeps 1 | no traits |
| Normal | each draws 2 traits, keeps 1 | draws 2, keeps 1 |
| Hard | each draws 2 traits, keeps 1 | draws 4, keeps 2 |
| Nightmare | each draws 2 traits, keeps 1 | draws 6, keeps 3 |

The killer always keeps the traits that suit him best.

### Killer difficulty: Tutorial or Normal (traits off only)
- **Tutorial** plays like a newer killer. He always follows the rules and still searches when it's obvious, but he chases the latest noise, assumes you stayed put, reacts one turn at a time, plays his good cards as soon as he has them, and blocks doors near himself. Now and then he picks a reasonable second-best option. He plays the same whoever he's up against. He's beatable without being silly, which makes him a good way to learn the game.
- **Normal** plays like an experienced killer. He expects you to run from noise and from him (though he allows for surprises), blocks your escape routes, and plans two turns ahead. He'll stop short to set up a chainsaw next turn, save his strong cards, and guard the radio early. He also adapts to your lineup: he goes after whoever is closest to being eliminated (especially when Marco or Caleb could heal them), treats Dylan with his Toughness up as a poor first target, and allows for Johnson's and George's faster repairs. He's only unpredictable when two choices are nearly equal.

With traits on, the killer always plays at Normal skill.

## Settings (⚙)
- **Show the killer's mind (spoilers).** Shows what the killer is thinking: a heat map of where he believes you are, his hand of cards, his estimate of your radio repairs, and how he's reading your lineup and your fear and health changes. It's useful for learning how the AI works or checking that it's behaving sensibly, but leave it off for a real game.
- **Board images (optional).** The app draws its own schematic map. If you have your own image of the board, you can load it and line it up once, and the app will draw its tokens on top of it. Images stay in your browser only; no board art is included with the app.

## Status
- Tested in thousands of simulated games across every trait level, every individual trait, both killer skills, and survivors who remove fear and heal, with no errors or stuck games.
- Difficulty is still being tuned through real play at my table.

## Plans
- More killers. The Murderer and the Spectre are next.
- More maps: the Cabin, the Laboratory, the Castle and the Tomb, with their special rules.
- The rulebook's other variants: Separate Ways and Survival Plan.

## How this was made
I have no programming background. The code was written by Claude, an AI assistant from Anthropic. I designed how the app should work, checked it against the rulebook, and test it at my own table.

## License
No license yet. All rights reserved for now. I'm still building this and plan to open it up once it's further along.

## Disclaimer
This is an unofficial fan project. It is not affiliated with or endorsed by Ice Makes. *Terrorscape* and its content belong to Ice Makes. You need a copy of the game to play.

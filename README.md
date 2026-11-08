# Terrorscape Solo Killer

A web app that plays the **killer** in the board game *Terrorscape* (Ice Makes, 2023), so you can play solo as the three survivors.

**Play it:** https://<your-username>.github.io/terrorscape-solo-killer/

The app sits "behind the screen." It holds the killer's deck and hand, decides his moves, and asks you only what the real rules make survivors reveal. You play the survivors on your physical board, and the app tells you where the killer goes and what he does.

## What it supports right now
- **Map:** The Mansion
- **Killer:** The Butcher. The rulebook recommends him for a first game.
- **Survivors:** all 9 (Anna, Caleb, Dylan, George, Johnson, Marco, Ophelia, Sophia, William), with their special abilities taken into account
- **Killer traits:** all 20, used by the killer when difficulty calls for them

## How a game works
1. **Setup.** Pick your 3 survivors and a difficulty, then start. The app tells you where the Butcher starts and which traits he has.
2. **Your turn (survivors).** Play your turn at the table as normal. Then tell the app only what the rules say the killer learns:
   - where noise was made (tap the rooms on the map)
   - any block tokens you removed
   - keys found, rescue called, or a Firecracker used
3. **The killer's turn.** The app plays the Butcher's turn and tells you what to do on the board: move his miniature, place blocks, and so on. When he uses [SEARCH] or [SENSE], or gives fear, answer honestly. Encounters are resolved at the table with real dice, and the app just asks whether the attack was repelled or someone was injured.
4. Repeat until someone wins.

Your game saves automatically in your browser, so you can close the page and resume later. There's also an **Undo** button for mistakes.

## How the killer thinks
The killer never sees where you are. He works it out the same way a human killer would.

- **Guessing where you are.** The app tracks how likely every possible combination of survivor locations is. After each of your turns it considers where each survivor could have moved, and it accounts for block tokens, secret passages and each character's abilities. It updates the odds from what you report:
  - **Noise** makes nearby rooms more likely, and **silence** makes the usual hiding spots (search rooms, the radio) less likely.
  - **Decoys** are accounted for. A Whiskey Bottle, Sophia's Camera or George's Note can make noise where nobody is.
  - **Honest answers** to [SEARCH], [SENSE] and fear are treated as certain. Anna is invisible to [SENSE], so her not being named tells him nothing.
- **Choosing a plan.** Each turn he picks what fits best: Revving Chainsaw when someone is likely within reach, a direct search when he's fairly sure of a room, Brutal Rage when it's worth the gamble, or a hunt toward the most likely area. He also blocks doors toward likely rooms, guards the radio when repairs look advanced, and gets more aggressive once a rescue is called or all 5 keys are found.
- **Not fully predictable.** About 5% of the time he goes after a less obvious target.

## Difficulty levels
The levels follow the rulebook's Trait variant (p.27).

| Level | Survivors | Killer |
|---|---|---|
| Vanilla | no traits | no traits |
| Easy | each draws 2 traits, keeps 1 | no traits |
| Normal | each draws 2 traits, keeps 1 | draws 2, keeps 1 |
| Hard | each draws 2 traits, keeps 1 | draws 4, keeps 2 |
| Nightmare | each draws 2 traits, keeps 1 | draws 6, keeps 3 |

The killer always keeps the traits that suit him best. His play quality is the same at every level, so the difference comes from the traits.

## Show the killer's mind (spoilers)
An optional toggle shows what the killer is thinking: a heat map of where he believes you are, his hand of cards, and his estimate of your radio repairs. It's useful for learning how the AI works or checking that it's behaving sensibly, but leave it off for a real game.

## Status
- Tested in hundreds of simulated games across every difficulty level and every trait, with no errors or stuck games.
- Difficulty is still being tuned through real play at my table.

## Plans
- More killers. The Spectre and the Murderer are likely next.
- More maps: the Cabin, the Laboratory, the Castle and the Tomb, with their special rules.
- Smarter Hard and Nightmare play, such as predicting escape routes and planning two turns ahead.
- The rulebook's other variants: Separate Ways and Survival Plan.

## How this was made
I have no programming background. The code was written by Claude, an AI assistant from Anthropic. I designed how the app should work, checked it against the rulebook, and test it at my own table.

## License
No license yet. All rights reserved for now. I'm still building this and plan to open it up once it's further along.

## Disclaimer
This is an unofficial fan project. It is not affiliated with or endorsed by Ice Makes. *Terrorscape* and its content belong to Ice Makes. You need a copy of the game to play.

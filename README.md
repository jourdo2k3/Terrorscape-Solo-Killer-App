# Terrorscape – Solo Killer

An unofficial, fan-made companion app that plays the **killer** in the board game *Terrorscape* (ICE Makes), so you can play solo or co-op as the three survivors.

The app sits "behind the screen." It holds the killer's deck and hand, decides his moves, and only asks you what the real rules make survivors reveal: noise locations, removed block tokens, answers to [SEARCH] and [SENSE], fear, and encounter results. You play everything else on the physical board.

> **You need a copy of Terrorscape to play.** This is a fan project and isn't affiliated with or endorsed by ICE Makes. No game art is included.

## Play it

It's a single HTML file with no install, server or libraries.

- **Locally:** download `index.html` and open it in a browser.
- **Hosted:** enable GitHub Pages for this repo (Settings → Pages → deploy from the `main` branch, root folder) and open the link it gives you.

Your game in progress saves in the browser automatically, so you can close the tab and resume later.

## What's supported

- **Map:** The Mansion
- **Killer:** The Butcher, with his full deck, level track, Brutal Rage and the level 4/5 upgrades
- **Survivors:** all 9 core survivors, with their abilities factored into how the killer reasons (Anna's invisibility to [SENSE], Sophia's secret passages, William's Sprint, and so on)
- **Difficulty:** Vanilla, plus the rulebook's Trait variant (Easy / Normal / Hard / Nightmare). All 20 killer traits are implemented, and the killer picks the ones that suit him best from what he draws.
- **Stealth:** reappearing with a free search, through Perilous Ambush
- **Undo** for the last round, and an optional **"killer's mind"** view (a heat map of where he thinks you are, plus his hand). It's full of spoilers, so it's meant for testing.

## How a round works

1. **Survivors' turn:** play your three survivors at the table as normal, then tell the app where the noise tokens are, which block tokens you removed, and the public info (keys on the stand, rescue).
2. **Killer's turn:** the app tells you exactly what the Butcher does: moves, cards played, blocks placed. Move his miniature and tokens on the board. When he searches, senses or attacks, answer honestly; encounters are rolled at the table.

## Board images (optional)

The app has its own schematic map. If you have your own image of a board (a scan, or the Tabletop Simulator map), you can show the game on it instead:

- Switch to **Board** above the map and choose your image. It's stored only in your browser and never uploaded.
- Use **Board setup** to line it up: click each room, optionally each door, and the 6 spaces of the repair track. Every click saves as you go.
- **Copy positions** backs up your line-up as text; **Load pasted positions** restores it.
- **Stream layout** makes the board large, which is handy for streaming. In OBS, capture the browser window.

Built-in position estimates are included for 2400 × 1473 crops of the five boards. They're rough, so lining up your own image is recommended.

Board images aren't included in this repo, and the `.gitignore` keeps image files out of it.

## How the killer thinks

The killer tracks a probability for every combination of where the three survivors could be (15³ = 3,375). Each round it:

- spreads that belief out by how far each survivor could have moved, accounting for blocks, secret passages and the survivors' likely goals (search rooms, the radio, the exit once 5 keys are found)
- updates on the noise you report, including silence and possible decoys (the Whiskey Bottle, Sophia's Camera, George's Notes)
- treats answers to [SEARCH], [SENSE] and fear as hard facts

It then picks a plan in order of payoff: Revving Chainsaw → move and search → Brutal Rage → hunt toward the most likely room. It uses blocks to cut off likely escape routes and guards the radio when repairs look advanced. There's a small random element, so he isn't fully predictable.

## Testing feedback wanted

This needs real games to tune. Useful things to report in an issue:

- difficulty: did the Butcher feel too easy or too hard, and at which level?
- anything he did that broke the rules, or a prompt that was confusing
- moments where he seemed to "know" too much or too little

**Known gaps:**

- Toying with the Prey is never used, because the killer never cancels encounters.
- The repair estimate counts one step per round of noise at the radio, so it runs low when Toolboxes are used.
- Only the Mansion and the Butcher are playable so far.

## Tests

A simulation harness plays random-but-legal survivors against the app and checks for errors, stuck states and broken game state. It needs Node.js.

```
node tests/extract-app.js
node tests/harness.js 50 all          # 50 games at each difficulty
node tests/harness.js 10 normal all   # 10 games with each killer trait forced on
```

## Roadmap

- More killers (the Spectre, the Murderer and others)
- The other maps: the Cabin, Laboratory, Castle and Tomb, with their special rules
- The Separate Ways and Survival Plan variants
- Smarter thinking at higher difficulties

## Credits and legal

*Terrorscape* and all related names, characters and card text are the property of ICE Makes. This project is an unofficial fan tool for owners of the game, made for personal and non-commercial use. If you're a rights holder and want something changed or removed, please open an issue.

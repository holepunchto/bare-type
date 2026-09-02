# Threat model

## What this is

`bare-type` is compiled into Bare. It is listed in `src/builtins.json`, so every Bare process has it. That holds whether or not the process sealed, and no code has to load anything to reach it.

So this addon is part of Bare, and [Bare's threat model](https://github.com/holepunchto/bare/blob/main/docs/threat-model.md) covers it. Read that one first. This one only says where this addon sits in it.

## What it inherits

- **The promise.** Bare promises a sealed process gets no new native code. This addon is native code that is already in, so the seal neither adds it nor takes it away.
- **The attacker.** Untrusted JavaScript in a sealed process. It writes what it likes, runs on as many threads as it wants, and calls anything it can reach in any order and all at once. It can reach all of this addon.
- **The trust.** This addon is trusted, because Bare compiles it in. Whatever you compile in is your security policy, and this is one of the things you picked.
- **The walls.** The same table applies. A thread is not a wall and neither is a realm, so nothing here gets to assume it is alone.
- **The rules.** What Bare says to report, and what Bare says is not a bug, is the same here.

## What counts

- **Counts:** `binding.c` and the JavaScript that ships with it. Sealed JavaScript reaches all of it without loading a thing.
- **Does not count:** tests, benchmarks, and scratch code.

## What this addon adds

Predicates. It says what a value is, across realms, and does nothing else.

It reaches nothing and keeps nothing. This is the smallest surface of the builtins.

## Where the risk is

It reads the type of values the caller already holds, so there is nothing to give away and nothing to reach. What is left is the C, which walks values that an attacker built.

Seeing across realms is not a hole. Bare's table already says a realm is not a wall, and objects cross freely in a shared heap whether this addon exists or not.

## What to report

- Memory bugs in `binding.c` that JavaScript can reach, on any value, proxies and revoked proxies included
- Anything on Bare's report list

Not a bug: that the predicates work across realms.

learn-geo-direction
===================

Assuming you're in London, in which direction would New York be?

Here's a [demo how you could learn](http://mknecht.github.io/learn-geo-direction/) such geographic directions.

For another demo, see my [city-locating project](https://github.com/mknecht/learn-geo). If you want to learn countries and rivers and lakes of the Earth (or languages or whatever), you could do worse than head over to [Memrise](http://memrise.com).

License & Credits
-----------------

The source code is released under the MIT license. See LICENSE file.

The **compass rose** is an adaption of the elegant one [from Wikipedia](http://en.wikipedia.org/wiki/File:Windrose.svg) by users Vloeck and Kane5187. They published it under [CC-by-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/deed.en), and accordingly mine is published under the terms of that license, too.

Tech
----

This demo is also about me playing with bower, d3, gulp and sass. Not everything is tested, it's not working in every browser, and it's not the most beautiful code in the world and all that is meant to be like that.

TODOs
-----

- [X] Indicate success or failure
- [X] Display actual direction after click.
- [X] Display introduction when starting the game.
- [X] Introduce different difficulty levels: boring (180 degrees), easy (90), challenging (45), nerdy (10), insane(3)
- [X] Stop moving selector after selection (click).
- [X] Center the compass rose.
- [X] Use SCSS to centralize colors, and to make z-indizes explicit.

Possibly:
- [ ] Test for distance, too.
- [X] Display random award texts.
- [X] Allow switching to rhumb-line bearing.
- [ ] When displaying actual direction, indicate distance. (log. scale)

# How to sounds

Using <http://github.grumdrig.com/jsfxr/> to generate base sound files

## SoX <http://sox.sourceforge.net/>

* Concatenate audio files: `$ sox sourceFile1 sourceFile2... outputFile.wav`
* Create silence: `$ sox -n -r 44100 -c 2 silence.wav trim 0.0 3.0`
* SoX effects:
  * `$ play 2.wav reverb -w|--wet-only`
  * `$ play -n synth 2.5 sin 667 gain 1 bend .35,180,.25  .15,740,.53  0,-520,.3`
  * `$ play 2.wav bend .35,180,.25  .15,740,.53  0,-520,.3`
  * `$ play 2.wav echo 0.8 0.88 60 0.4`
  * `$ play 2.wav chorus 0.6 0.9 50 0.4 0.25 2 -t 60 0.32 0.4 1.3 -s`
  * `$ play 2.wav reverb`
  * `$ play 2.wav phaser 0.6 0.66 3 0.6 2 -t`
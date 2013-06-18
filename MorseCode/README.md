A sample application that will cycle through the following messages in Morse Code:

A pangram:

    "JACKDAWS LOVE MY BIG SPHINX OF QUARTZ"

The digits:

    "0123456789"

Some punctuation:

    ".,?'!/()&:;=+-_\"$@"

In between each message, the LED will flash rapidly 10 times.

#### Generating the header file

(More comments in the JS file)

Run using Rhino:

    java -jar /path/to/rhino/js.jar -opt -1 generate-data-structure.js > MorseLib.h

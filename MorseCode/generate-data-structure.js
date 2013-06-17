/*
Javascript application to generate some of the Digispark Morse Code data
structures.

Why do we do this?

Because it's simpler (I think) to save the dots and dashes here, and transform
them into smaller (integer) structures for the Digispark.

But also we can quickly run out of memory in the Digispark using chars and
strings (I have seen this).

Redirect this output to a file, or copy from the console.

Run using Rhino:
    java -jar /path/to/rhino/js.jar -opt -1 generate-data-structure.js > MorseLib.h
*/





// ----------------------------
// Start of readable structures
// ----------------------------

var mA_TO_Z = [
  ".-",
  "-...",
  "-.-.",
  "-..",
  ".",
  "..-.",
  "--.",
  "....",
  "..",
  ".---",
  "-.-",
  ".-..",
  "--",
  "-.",
  "---",
  ".--.",
  "--.-",
  ".-.",
  "...",
  "-",
  "..-",
  "...-",
  ".--",
  "-..-",
  "-.--",
  "--.."
];

var mZERO_TO_NINE = [
  "-----",
  ".----",
  "..---",
  "...--",
  "....-",
  ".....",
  "-....",
  "--...",
  "---..",
  "----."
];

// Punctuation morse code. Must match sPUNCTUATION.
var mPUNCTUATION = [
  ".-.-.-",  // Period [.]
  "--..--",  // Comma [,]
  "..--..",  // Question mark [?]
  ".----.",  // Apostrophe [']
  "-.-.--",  // Exclamation mark [!]
  "-..-.",   // Slash [/], Fraction bar
  "-.--.",   // Parenthesis open [(]
  "-.--.-",  // Parenthesis closed [)]
  ".-...",   // Ampersand [&], Wait
  "---...",  // Colon [:]
  "-.-.-.",  // Semicolon [;]
  "-...-",   // Double dash [=]
  ".-.-.",   // Plus [+]
  "-....-",  // Hyphen, Minus [-]
  "..--.-",  // Underscore [_]
  ".-..-.",  // Quotation mark ["]
  "...-..-", // Dollar sign [$]
  ".--.-."  // (=A+C) At sign [@]
];

var sPUNCTUATION = ".,?'!/()&:;=+-_\"$@";

// ----------------------------
// End of readable structures
// ----------------------------











// Convert code string into binary morse code string.
// E.g. 'B' is 'B00001000'
// E.g. 'A' is 'B00000001'
// Note the lengths are stored separately.
// E.g. 'A' is length 2, but only appears like it's length 1 (because of leading zero).
function morseToBinary(code) {
    var arr = code;
    if (!(code instanceof Array)) {
        code = [code];
    }
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        code = arr[i];
        code = code.replace(/\./gi, "0").replace(/\-/gi, "1");
        var s = parseInt(code, 2).toString(2);
        while (s.length < 8) {
            s = "0" + s;
        }
        result[i] = "B" + s;
    }
    return result;
}

// Return the length of the morse code.
// E.g. 1 for 'A' for ".-"
// E.g. 4 for 'B' for "-..."
function morseToLength(code) {
    var arr = code;
    if (!(code instanceof Array)) {
        code = [code];
    }
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        code = arr[i];
        result[i] = code.length;
    }
    return result;
}

// Add comment string.
// E.g. for alpha, start will be bound to 65 ('A').
// For digits, start will be bound to 48 ('0').
function addComments(start, it, i) {
    return it + " //" + String.fromCharCode(start + i);
}

// Add punctuation comment
function addPuncComments(it, i) {
    return it + " //'" + sPUNCTUATION[i] + "'";
}

function printAll() {
    var p = print;

    function printArrayAsDigisparkStructure(name, arr, commentMapper) {
        p("unsigned int " + name + "[] = {");
        p(morseToBinary(arr).join(",\n").split("\n").map(commentMapper).join("\n"));
        p("};");

        p("unsigned int " + name + "_LEN[] = {");
        p(morseToLength(arr).join(",\n").split("\n").map(commentMapper).join("\n"));
        p("};");
    }

    // Required for things link Bxxx notation for binary literals
    p("#include <Arduino.h>;");

    p("");
    printArrayAsDigisparkStructure("imA_TO_Z", mA_TO_Z, addComments.bind(null, 65));
    printArrayAsDigisparkStructure("imZERO_TO_NINE", mZERO_TO_NINE, addComments.bind(null, 65));
    printArrayAsDigisparkStructure("imPUNCTUATION", mPUNCTUATION, addPuncComments);

    p("");
    p("// Punctuation symbols. Must match imPUNCTUATION.");
    p('char sPUNCTUATION[] = "' + sPUNCTUATION.replace(/"/, '\\"') + '";');
    p("int PUNCTUATION_LENGTH = sizeof(sPUNCTUATION) / sizeof(char);");
}

// Output the Digispark structures
printAll();

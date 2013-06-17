#include "MorseLib.h";

// Remember! All string literals are null terminated!

// Null terminating character
char NUL_CHAR = 0;

// Duration constants
int DOT_DURATION = 300;
// The duration of a dash is thrice that of a dot
int DASH_DURATION = DOT_DURATION * 3;
// The delay between dot/dash components of a letter is 3 x DOT_DURATION
int INTER_DOTDASH_DURATION = DOT_DURATION;
// The delay between letters in a word
int INTER_LETTER_DURATION = DOT_DURATION * 3;
// The delay between words
int INTER_WORD_DURATION = DOT_DURATION * 7;





// LED on Model A Digispark is PIN 1
int LED_PIN = 1;





void outputLetter(unsigned int morseEncoded, int len) {
    int count = 0;
    while (true) {
        digitalWrite(LED_PIN, LOW);
        len--;
        if (len < 0) {
            // Something we don't recognise, so quit the loop.
            // We expect this to be NUL, though ('\0').
            break;
        }
        if (count > 0) {
            delay(INTER_DOTDASH_DURATION);
        }
        int c = bitRead(morseEncoded, len);
        if (0 == c) {
            digitalWrite(LED_PIN, HIGH);
            delay(DOT_DURATION);
        } else if (1 == c) {
            digitalWrite(LED_PIN, HIGH);
            delay(DASH_DURATION);
        }
        count++;
    }
    digitalWrite(LED_PIN, LOW);
}


int findPunctuation(char c) {
    for (int i = 0; i < PUNCTUATION_LENGTH; i++) {
        if (c == sPUNCTUATION[i]) {
            return i;
        }
    }
    return -1;
}

/**
* If 'c' is recognised, output the character 'c' as morse code and return true.
* If 'c' is not recognised, return false.
*/
boolean outputChar(char c) {
    if (c >= 'A' && c <= 'Z') {
        int idx = c - 'A';
        outputLetter(imA_TO_Z[idx], imA_TO_Z_LEN[idx]);
        return true;
    }

    if (c >= '0' && c <= '9') {
        int idx = c - '0';
        outputLetter(imZERO_TO_NINE[idx], imZERO_TO_NINE_LEN[idx]);
        return true;
    }

    int p = findPunctuation(c);
    if (p < 0) {
        return false;
    }

    outputLetter(imPUNCTUATION[p], imPUNCTUATION_LEN[p]);
    return true;
}

/**
* @oaram message NUL-terminated string.
*/
void outputMessage(const char* message) {
    int i = 0;
    char prev = NUL_CHAR;

    // i == -1 if we wait for a NUL char, and will never be equal to i, so we loop.
    // If i != -1, then we wait until i equals len
    while (true) {
        char c = message[i];
        if (NUL_CHAR == c) {
            // End of message. Blink as a sign.
            delay(1000);
            blink(10);
            delay(1000);
            break;
        } else if (' ' == c) {
            // Space. Word delay.
            delay(INTER_WORD_DURATION);
        } else {
            if (' ' != prev) {
                // Previous character was not a space, so we use the inter-letter-duration.
                delay(INTER_LETTER_DURATION);
            }
            outputChar(c);
        }
        prev = c;
        i++;
    }
}

void blink(int n) {
    while (n-- > 0) {
        digitalWrite(LED_PIN, HIGH);
        delay(150);
        digitalWrite(LED_PIN, LOW);
        delay(150);
    }
}

// the setup routine runs once when you press reset:
void setup() {
    // initialize the digital pin as an output.
    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, LOW);
}

void pangramMessage() {
    outputMessage("JACKDAWS LOVE MY BIG SPHINX OF QUARTZ");
}

void numbersMessage() {
    outputMessage("0123456789");
}

void punctuationMessage() {
    outputMessage(sPUNCTUATION);
}

// Main loop
void loop() {
    // Output the message. Terminate with NUL.
    pangramMessage();
    delay(2000);
    numbersMessage();
    delay(2000);
    punctuationMessage();
    delay(2000);
}

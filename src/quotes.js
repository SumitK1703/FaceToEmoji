const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const quotesDB = {
  neutral: [
    "Serenity comes when you trade expectations for acceptance.",
    "The quieter you become, the more you can hear.",
    "Peace is the result of retraining your mind to process life as it is.",
    "Do not let the behavior of others destroy your inner peace."
  ],
  happy: [
    "Happiness is not something ready made. It comes from your own actions.",
    "The only way to have a friend is to be one.",
    "Count your age by friends, not years. Count your life by smiles, not tears.",
    "Let us be grateful to the people who make us happy."
  ],
  sad: [
    "Tears represent your heart's ability to heal. Let it out.",
    "Every flower must grow through dirt.",
    "This too shall pass.",
    "It is okay to be not okay. Just don't stay there too long."
  ],
  angry: [
    "For every minute you remain angry, you give up sixty seconds of peace.",
    "Speak when you are angry and you will make the best speech you will ever regret.",
    "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured.",
    "Hold your peace."
  ],
  fearful: [
    "Fear is a reaction. Courage is a decision.",
    "Everything you've ever wanted is on the other side of fear.",
    "Scared is what you're feeling. Brave is what you're doing.",
    "Do the thing you fear and the death of fear is certain."
  ],
  disgusted: [
    "Standards are high, just like your taste.",
    "Keep your heels, head, and standards high.",
    "Dignity does not float down, it must be earned and maintained.",
    "Respect yourself enough to walk away from anything that no longer serves you."
  ],
  surprised: [
    "Life is full of surprises, and so are you!",
    "Expect nothing, appreciate everything.",
    "The best things in life happen unexpectedly.",
    "Life is 10% what happens to us and 90% how we react to it."
  ]
};

export const getQuote = (emotion) => {
  if (quotesDB[emotion]) {
    return getRandom(quotesDB[emotion]);
  }
  return "Keep smiling!";
};
import verbs from "./verbs.json";

export const TENSE = {
  SIMPLE: "Simple",
  PROGRESSIVE: "Progressive",
  PERFECT: "Perfect",
  PERFECT_PROGRESSIVE: "Perfect Progressive"
};

export const TIME = {
  PRESENT: "Present",
  PAST: "Past",
  FUTURE: "Future",
  CONDITIONAL: "Conditional"
};

export const PERSON = {
  FIRST: "First",
  SECOND: "Second",
  THIRD: "Third"
};

export const PLURALITY = {
  SINGULAR: "Singular",
  PLURAL: "Plural"
};

const isFirstPerson = person => person === PERSON.FIRST;
const isSecondPerson = person => person === PERSON.SECOND;
const isThirdPerson = person => person === PERSON.THIRD;

const isSingularPlurality = plurality => plurality === PLURALITY.SINGULAR;
const isPluralPlurality = plurality => plurality === PLURALITY.PLURAL;

const isPresentTime = time => time === TIME.PRESENT;
const isPastTime = time => time === TIME.PAST;
const isFutureTime = time => time === TIME.FUTURE;
const isConditionalTime = time => time === TIME.CONDITIONAL;

const isSimpleTense = tense => tense === TENSE.SIMPLE;
const isProgressiveTense = tense => tense === TENSE.PROGRESSIVE;
const isPerfectTense = tense => tense === TENSE.PERFECT;

function simpleTenseOfBe(time, person, plurality) {
  const isFirst = isFirstPerson(person);
  const isSecond = isSecondPerson(person);
  const isThird = isThirdPerson(person);
  const isSingular = isSingularPlurality(plurality);
  const isPlural = isPluralPlurality(plurality);
  const isPresent = isPresentTime(time);
  const isPast = isPastTime(time);
  const isFuture = isFutureTime(time);
  const isConditional = isConditionalTime(time);

  if (isPresent) {
    if (isFirst && isSingular) {
      return "am";
    } else {
      return isFirst || isSecond || (isThird && isPlural) ? "are" : "is";
    }
  } else if (isPast) {
    return (isFirst && isSingular) || (isThird && isSingular) ? "was" : "were";
  } else if (isFuture) {
    return "will be";
  } else if (isConditional) {
    return "would be";
  }
}

function simpleTenseOfHave(time, person, plurality) {
  const isPresent = isPresentTime(time);
  const isPast = isPastTime(time);
  const isFuture = isFutureTime(time);
  const isThird = isThirdPerson(person);
  const isSingular = isSingularPlurality(plurality);

  if (isPresent) {
    return isThird && isSingular ? "has" : "have";
  } else if (isPast) {
    return "had";
  } else if (isFuture) {
    return "will have";
  } else {
    return "would have";
  }
}

class DefaultConjugationTable {
  constructor(data) {
    this.data = data;
  }
  structure = [
    ["I", PERSON.FIRST, PLURALITY.SINGULAR],
    ["You", PERSON.SECOND, PLURALITY.SINGULAR],
    ["He", PERSON.THIRD, PLURALITY.SINGULAR],
    ["She", PERSON.THIRD, PLURALITY.SINGULAR],
    ["It", PERSON.THIRD, PLURALITY.SINGULAR],
    ["We", PERSON.FIRST, PLURALITY.PLURAL],
    ["They", PERSON.THIRD, PLURALITY.PLURAL]
  ];

  getConjugationTable(tense) {
    const table = {};
    Object.values(TENSE).forEach(tense => {
      table[tense] = {};
      Object.values(TIME).forEach(time => {
        table[tense][time] = {};
        this.structure.forEach(([pronoun, person, plurality]) => {
          const words = this.get(tense, time, person, plurality);
          table[tense][time][pronoun] = [pronoun].concat(words);
        });
      });
    });
    return table;
  }
}

class BeConjugation extends DefaultConjugationTable {
  get infinitive() {
    return this.data[0];
  }
  get participle() {
    return this.data[1];
  }
  get progressive() {
    return this.data[2];
  }

  get(tense, time, person, plurality) {
    const isSimple = isSimpleTense(tense);
    const isProgressive = isProgressiveTense(tense);
    const isPerfect = isPerfectTense(tense);
    const be = simpleTenseOfBe(time, person, plurality);
    const have = simpleTenseOfHave(time, person, plurality);

    if (isSimple) {
      return [be];
    } else if (isProgressive) {
      return [be, this.progressive];
    } else if (isPerfect) {
      return [have, this.participle];
    } else {
      return [`${have} been`, this.progressive];
    }
  }
}

class DefaultConjugation extends DefaultConjugationTable {
  get infinitive() {
    return this.data[0];
  }
  get participle() {
    return this.data[3];
  }
  get progressive() {
    return this.data[2];
  }
  get past() {
    return this.data[1];
  }
  get thirdPerson() {
    return this.data[4];
  }

  get(tense, time, person, plurality) {
    const isSimple = isSimpleTense(tense);
    const isProgressive = isProgressiveTense(tense);
    const isPerfect = isPerfectTense(tense);
    const be = simpleTenseOfBe(time, person, plurality);
    const have = simpleTenseOfHave(time, person, plurality);

    if (isSimple) {
      return this.getSimpleTenseConjugation(tense, time, person, plurality);
    } else if (isProgressive) {
      return [be, this.progressive];
    } else if (isPerfect) {
      return [have, this.participle];
    } else {
      return [`${have} been`, this.progressive];
    }
  }

  getSimpleTenseConjugation(tense, time, person, plurality) {
    const isPresent = isPresentTime(time);
    const isPast = isPastTime(time);
    const isConditional = isConditionalTime(time);
    const isFuture = isFutureTime(time);
    const isThird = isThirdPerson(person);
    const isSingular = isSingularPlurality(plurality);

    if (isPresent) {
      return isThird && isSingular ? [this.thirdPerson] : [this.infinitive];
    } else if (isPast) {
      return [this.past];
    } else if (isConditional) {
      return ["would", this.infinitive];
    } else if (isFuture) {
      return ["will", this.infinitive];
    }
  }
}

export default class ConjugationService {
  normalize(search) {
    search = search.trim().toLowerCase();
    if (search.startsWith("to ") && search.length > 3) {
      search = search.slice(3);
    }
    return search;
  }

  list() {
    return verbs;
  }

  find(verb) {
    verb = this.normalize(verb);
    const data = this.findByInfinitive(verb);
    if (!data) {
      return null;
    }
    if (data[0] === "be") {
      return new BeConjugation(data);
    }
    return new DefaultConjugation(data);
  }

  findByInfinitive(verb) {
    return verbs.find(data => data[0] === verb);
  }
}

module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect from ${rules.min} to ${rules.max}, got ${value.length}`});
          }
          if (value.length > rules.max) {
            errors.push({field, error: `too long, expect from ${rules.min} to ${rules.max}, got ${value.length}`});
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({field, error: `too little, expect from ${rules.min} to ${rules.max}, got ${value}`});
          }
          if (value > rules.max) {
            errors.push({field, error: `too big, expect from ${rules.min} to ${rules.max}, got ${value}`});
          }
          break;
      }
    }

    return errors;
  }
};

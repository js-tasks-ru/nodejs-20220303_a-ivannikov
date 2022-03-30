const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет тип поля имени', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 1234 });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });
    it('валидатор проверяет допустимую длину имени', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      let errors = validator.validate({ name: 'Lalala' });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect from 10 to 20, got 6');

      errors = validator.validate({ name: 'Lalala Lalala Lalala Lalala' });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect from 10 to 20, got 27');
    });
    it('валидатор проверяет тип поля возраста', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({ age: [25] });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got object');
    });
    it('валидатор проверяет допустимый диапазон возраста', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      let errors = validator.validate({ age: 17 });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect from 18 to 27, got 17');

      errors = validator.validate({ age: 28 });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect from 18 to 27, got 28');
    });
    it('валидатор не выдаёт ошибок для корректных значений', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      expect(validator.validate({ name: 'Lalala Lal', age: 18 })).to.have.length(0);
      expect(validator.validate({ name: 'Lalala Lalala',age: 23 })).to.have.length(0);
      expect(validator.validate({ name: 'Lalala Lalala Lalala', age: 27 })).to.have.length(0);
    });
  });
});

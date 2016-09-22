export default class Field {
  constructor(field) {
    this.field = field;
  }

  _operator(operator, value){
    return [this.field, [`$${operator}`, value]]
  }

  eq(value){ return this._operator('eq', value); }
  ne(value){ return this._operator('ne', value); }
  lt(value){ return this._operator('lt', value); }
  le(value){ return this._operator('le', value); }
  gt(value){ return this._operator('gt', value); }
  ge(value){ return this._operator('ge', value); }
  ieq(value){ return this._operator('ieq', value); }
  in(value){ return this._operator('in', value); }
  match(value){ return this._operator('match', value); }
  starts(value){ return this._operator('starts', value); }
  istarts(value){ return this._operator('istarts', value); }
  ends(value){ return this._operator('ends', value); }
  iends(value){ return this._operator('iends', value); }
  intersects(value){ return this._operator('intersects', value); }
  includes(value){ return this._operator('includes', value); }

  _modifier(modifier){
    return new Field(`${this.field}.$${modifier}`);
  }

  date(){ return this._modifier('date'); }
  time(){ return this._modifier('time'); }
  year(){ return this._modifier('year'); }
  month(){ return this._modifier('month'); }
  day(){ return this._modifier('day'); }
  hours(){ return this._modifier('hours'); }
  minutes(){ return this._modifier('minutes'); }
  seconds(){ return this._modifier('seconds'); }
  day_of_month(){ return this._modifier('day_of_month'); }
  day_of_year(){ return this._modifier('day_of_year'); }
  timezone(){ return this._modifier('timezone'); }
}

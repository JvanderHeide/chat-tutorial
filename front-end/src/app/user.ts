export class User {
  private _name:String;
  private _id:String;

  constructor(user: any) {
    this._name = user.name;
    this._id = user.id;
  }
  get name(): String {
    return this._name;
  }
  get id(): String {
    return this._id;
  }

}

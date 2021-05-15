export class Users {
    uId?: string;
    email?: string;
    fullName?: string;
    password?: string;
    age?: string;
    dob?: string;
    roles?: any;
    constructor(uId, email, fullName, age, dob, roles) {
        this.uId = uId;
        this.email = email;
        this.fullName = fullName;
        this.age = age;
        this.dob = dob;
        this.roles = roles;
    }
}

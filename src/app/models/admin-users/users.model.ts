export class Users {
    uId?: string;
    email?: string;
    fullName?: string;
    password?: string;
    age?: string;
    dob?: string;
    role?: string;   // contract-first: flat role name from UserResponse ("NO_ROLE" when unassigned)
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

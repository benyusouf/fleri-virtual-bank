import {Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt} from 'sequelize-typescript';
import { BankAccount } from '../../accounts/models/BankAccount';

@Table
export class Customer extends Model<Customer> {

    @PrimaryKey
    @Column
    public email!: string;

    @Column
    public first_name!: string;

    @Column
    public last_name!: string;

    @Column
    @CreatedAt
    public createdAt: Date = new Date();

    @HasMany(() => BankAccount)
    accounts: BankAccount[]

    @Column
    @UpdatedAt
    public updatedAt: Date = new Date();

    fullName() {
        return `${this.first_name} ${this.last_name}`;
    }
}
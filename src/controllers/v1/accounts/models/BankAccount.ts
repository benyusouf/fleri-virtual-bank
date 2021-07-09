import { Transaction } from '../../transactions/models/Transaction';
import {Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt, Unique, ForeignKey, BelongsTo} from 'sequelize-typescript';
import { Customer } from '../../customers/models/Customer';

@Table
export class BankAccount extends Model<BankAccount> {

    @Unique
    @Column
    public account_number!: string;

    @Column
    @ForeignKey(() => Customer)
    public customer_id!: number;

    @BelongsTo(() => Customer)
    public customer: Customer

    @Column
    public balance!: number;

    @HasMany(() => Transaction)
    public transactions: Transaction[]

    @Column
    @CreatedAt
    public createdAt: Date = new Date();

    @Column
    @UpdatedAt
    public updatedAt: Date = new Date();

    getBalance() {
        return this.balance;
    }
}
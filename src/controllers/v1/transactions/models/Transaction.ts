import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, HasMany, Model, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { BankAccount } from "../../accounts/models/BankAccount";

@Table
export class Transaction extends Model<Transaction> {

    @Unique
    @Column
    public reference!: string;

    @Column
    @ForeignKey(() => BankAccount)
    public account_id!: number;

    @Column
    public amount!: number;

    @BelongsTo(() => BankAccount)
    public account: BankAccount

    @Column({ type: DataType.ENUM({ values: Object.keys(TransactionType) }) })
    public type!: TransactionType;

    @Column
    public balanceBefore!: number;

    @Column
    public balanceAfter!: number;

    @Column
    @CreatedAt
    public createdAt: Date = new Date();

    @Column
    @UpdatedAt
    public updatedAt: Date = new Date();
}
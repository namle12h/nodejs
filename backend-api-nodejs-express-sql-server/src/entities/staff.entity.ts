import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'staff' }) //==> Đặt tên table, nếu ko thì nó lấy = tên của Class bên dưới
export class Staff {
    @PrimaryGeneratedColumn() //Tự tạo ID, từ khóa chính, ID tăng giần
    staff_id: number

    @Column("nvarchar", { length: 20 }) // DataType cho trường fistName
    firstName: string

    @Column("nvarchar", { length: 20 })
    lastName: string


    @Column({ type: "nvarchar", length: 255 })
    email: string;

    @Column("nvarchar", { length: 255 })
    password: string

    @Column({ type: "bit", default: true })
    active: boolean
}
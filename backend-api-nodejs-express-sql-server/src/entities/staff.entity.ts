import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'staff' }) //==> Đặt tên table, nếu ko thì nó lấy = tên của Class bên dưới
export class Staff {
    @PrimaryGeneratedColumn() //Tự tạo ID, từ khóa chính, ID tăng giần
    staff_id: number

    @Column({ type: "nvarchar", length: 20, default: '' })
    firstName: string;


    @Column({ type: "nvarchar", length: 20, default: '' })
    lastName: string;

    @Column({ type: "nvarchar", length: 255, default: '' })
    email: string;

    @Column({ type: "nvarchar", length: 255, default: '' })
    password: string;


    @Column({ type: "bit", default: true })
    active: boolean
}
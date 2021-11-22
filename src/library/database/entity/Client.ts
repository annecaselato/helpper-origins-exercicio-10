import { Entity, ObjectID, ObjectIdColumn, Column, BaseEntity } from 'typeorm';

// Models
import { EnumStatus } from '../../../models';

@Entity()
export class Client extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column({ unique: true })
    public name: string;

    @Column({ unique: true })
    public email: string;

    @Column({ unique: true })
    public phone: string;

    @Column({ type: 'enum', enum: EnumStatus })
    public status: EnumStatus;
}

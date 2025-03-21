// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ClientRepository } from '../../../../library/database/repository/ClientRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { Client } from '../../../../library/database/entity';

// Models
import { EnumStatus } from '../../../../models';

/**
 * ClientValidator
 *
 * Classe de validadores para o endpoint de clientes
 */
export class ClientValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de clientes
     */
    private static model: Schema = {
        name: BaseValidator.validators.name,
        email: BaseValidator.validators.email,
        phone: BaseValidator.validators.phone,
        status: {
            in: 'body',
            custom: {
                options: status => {
                    return Object.values(EnumStatus).includes(status);
                }
            },
            trim: true,
            errorMessage: 'Status inválido'
        },
        id: {
            ...BaseValidator.validators.id(new ClientRepository()),
            errorMessage: 'Cliente não encontrado'
        },
        duplicate: {
            errorMessage: 'Cliente já existe',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.name) {
                        const clientRepository: ClientRepository = new ClientRepository();
                        const client: Client | undefined = await clientRepository.findByName(req.body.name);

                        check = client ? req.body.id === client.id.toString() : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        }
    };

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return ClientValidator.validationList({
            name: ClientValidator.model.name,
            email: ClientValidator.model.email,
            phone: ClientValidator.model.phone,
            status: ClientValidator.model.status,
            duplicate: ClientValidator.model.duplicate
        });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return ClientValidator.validationList({
            id: ClientValidator.model.id,
            ...ClientValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: ClientValidator.model.id
        });
    }
}

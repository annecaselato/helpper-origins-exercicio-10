// Modules
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { checkSchema, Result, Schema, ParamSchema, ValidationError, validationResult, Meta } from 'express-validator';

// Utils
import { StringUtils } from '../utils';

// Routes
import { RouteResponse } from '../routes';

// Repositories
import { BaseRepository } from './database/repository';

/**
 * BaseValidator
 *
 * Classe para tratamentos relacionados aos middlewares de validação de parâmetros
 */
export class BaseValidator {
    /**
     * validators
     *
     * Schema base para validação no controller
     */
    protected static validators: Record<string, ParamSchema> | any = {
        id: (repository: BaseRepository): ParamSchema => {
            return {
                in: ['body', 'params'],
                isMongoId: true, // Não usar em caso de banco diferente do MongoDB
                custom: {
                    options: async (value: string, { req }: Meta) => {
                        const data = await repository.findOne(value);

                        // Usa o nome do repositório para criar o nome de referência. Ex: UserRepository => userRef
                        const refName: string = StringUtils.firstLowerCase(repository.constructor.name.replace('Repository', ''));

                        req.body[`${refName}Ref`] = data;

                        return data ? Promise.resolve() : Promise.reject();
                    }
                },
                errorMessage: 'ID não encontrado'
            };
        },
        name: {
            in: 'body',
            isString: true,
            isLength: {
                options: {
                    min: 3
                }
            },
            customSanitizer: {
                options: (value: string) => {
                    if (typeof value === 'string') {
                        return StringUtils.firstUpperCase(value);
                    }

                    return undefined;
                }
            },
            errorMessage: 'Nome inválido'
        },
        email: {
            in: 'body',
            isString: true,
            isEmail: true,
            trim: true,
            errorMessage: 'Email inválido'
        },
        phone: {
            in: 'body',
            isString: true,
            matches: {
                options: [/^\(?[1-9]{2}\)?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/]
            },
            trim: true,
            errorMessage: 'Telefone inválido'
        }
    };

    /**
     * validationList
     *
     * Retorna o middleware que valida os campos e o que retorna os erros
     *
     * @param schema - Schema com as opções de validação
     *
     * @returns Lista de validadores
     */
    protected static validationList(schema: Schema): RequestHandler[] {
        return [<any>checkSchema(schema), BaseValidator.checkError];
    }

    /**
     * checkError
     *
     * Verifica se existem erros nos parâmetros e da mensagem de erro
     *
     * @param req - Requisição
     * @param res - Resposta da requisição
     * @param next - Callback
     */
    private static checkError(req: Request, res: Response, next: NextFunction): void {
        const errors: Result<ValidationError> = validationResult(req);

        if (!errors.isEmpty()) {
            RouteResponse.error(errors.array(), res);
        } else {
            next();
        }
    }

    /**
     * onlyId
     *
     * Retorna o middleware que valida o ID
     *
     * @param repository - Repositório para manipulação da entidade
     *
     * @returns Lista de validadores
     */
    public static onlyId(repository: BaseRepository): RequestHandler[] {
        return BaseValidator.validationList({ id: BaseValidator.validators.id(repository) });
    }
}

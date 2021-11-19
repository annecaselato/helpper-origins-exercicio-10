// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Delete, Get, Middlewares, Post, PublicRoute, Put } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { Client } from '../../../../library/database/entity';

// Repositories
import { ClientRepository } from '../../../../library/database/repository';

// Validators
import { ClientValidator } from '../middlewares/ClientValidator';

@Controller(EnumEndpoints.CLIENT_V1)
export class ClientController extends BaseController {
    /**
     * @swagger
     * /v1/client:
     *   get:
     *     summary: Lista os clientes
     *     tags: [Clients]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '#/components/parameters/listPageRef'
     *       - $ref: '#/components/parameters/listSizeRef'
     *       - $ref: '#/components/parameters/listOrderRef'
     *       - $ref: '#/components/parameters/listOrderByRef'
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get()
    @PublicRoute()
    public async get(req: Request, res: Response): Promise<void> {
        const [rows, count] = await new ClientRepository().list<Client>(ClientController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     * /v1/client/{clientId}:
     *   get:
     *     summary: Retorna informações de um cliente
     *     tags: [Clients]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: clientId
     *         email: clientEmail
     *         phone: clientPhone
     *         status: clientStatus
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/:id')
    @PublicRoute()
    @Middlewares(ClientValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.clientRef }, res);
    }

    /**
     * @swagger
     * /v1/client:
     *   post:
     *     summary: Cadastra um cliente
     *     tags: [Clients]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               name: clientName
     *               email: clientEmail
     *               phone: clientPhone
     *               status: clientStatus
     *             required:
     *               - name
     *               - email
     *               - phone
     *               - status
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               phone:
     *                 type: string
     *               status:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @PublicRoute()
    @Middlewares(ClientValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const newClient: DeepPartial<Client> = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            status: req.body.status
        };

        await new ClientRepository().insert(newClient);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/client:
     *   put:
     *     summary: Altera um cliente
     *     tags: [Clients]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               id: clientId
     *               name: clientName
     *               email: clientEmail
     *               phone: clientPhone
     *               status: clientStatus
     *             required:
     *               - id
     *               - name
     *               - email
     *               - phone
     *               - status
     *             properties:
     *               id:
     *                 type: string
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               phone:
     *                 type: string
     *               status:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @PublicRoute()
    @Middlewares(ClientValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const client: Client = req.body.clientRef;

        client.name = req.body.name;
        client.email = req.body.email;
        client.phone = req.body.phone;
        client.status = req.body.status;

        await new ClientRepository().update(client);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/client/{clientId}:
     *   delete:
     *     summary: Apaga um cliente definitivamente
     *     tags: [Clients]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: clientId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Delete('/:id')
    @PublicRoute()
    @Middlewares(ClientValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new ClientRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}

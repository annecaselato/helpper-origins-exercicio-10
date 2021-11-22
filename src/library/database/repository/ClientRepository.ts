// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

// Entities
import { Client } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * ClientRepository
 *
 * Repositório para tabela de clientes
 */
export class ClientRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Client;
    }

    /**
     * insert
     *
     * Adiciona um novo cliente
     *
     * @param client - Dados do cliente
     *
     * @returns Cliente adicionado
     */
    public insert(client: DeepPartial<Client>): Promise<Client> {
        const clientRepository: Repository<Client> = this.getConnection().getRepository(Client);
        return clientRepository.save(clientRepository.create(client));
    }

    /**
     * update
     *
     * Altera um cliente
     *
     * @param client - Dados do cliente
     *
     * @returns Cliente alterado
     */
    public update(client: Client): Promise<Client> {
        return this.getConnection().getRepository(Client).save(client);
    }

    /**
     * delete
     *
     * Remove um cliente pelo ID
     *
     * @param id - ID do cliente
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Client).delete(id);
    }

    /**
     * findByName
     *
     * Busca um cliente pelo nome
     *
     * @param name - Nome do cliente
     *
     * @returns Cliente buscado
     */
    public findByName(name: string): Promise<Client | undefined> {
        return this.getConnection().getRepository(Client).findOne({ name });
    }
}

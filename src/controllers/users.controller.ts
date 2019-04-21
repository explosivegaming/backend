import { Authorized, Get, JsonController, Param, Res, QueryParam } from 'routing-controllers';
import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AccountRelations, AccountRepository, AccountRepositoryRelations, AccountType } from '../entities/user.entity';
import { ApiPermission } from '../entities/key.entity';
import { log } from '../lib/log';

@Service()
@JsonController('/users')
export class UserController {

    constructor() {
        // because @InjectRepository does not want to work
        this.userRepo = getCustomRepository(AccountRepository)
    }

    //@InjectRepository()
    private userRepo: AccountRepository

    @Get('/')
    @Authorized(1 | ApiPermission.ReadUsers)
    users(@QueryParam('user') userId: string) {
        if (userId) {
            debugLog(`Sent one user: <${userId}>`)
            return this.userRepo.findOne(userId, { relations: AccountRepositoryRelations })
        } else {
            debugLog('Sent all users')
            return this.userRepo.find({ relations: AccountRepositoryRelations })
        }
    }

    @Get('/factorio')
    @Authorized(1 | ApiPermission.ReadUsers)
    allFactorio() {
        debugLog('Sent all <factorio> users')
        return this.userRepo.factorioUsers.find({ relations: AccountRelations })
    }

    @Get('/factorio/:name')
    @Authorized(1 | ApiPermission.ReadUsers)
    oneFactorio(@Param('name') name: string) {
        debugLog(`Sent one user: factorio<${name}>`)
        const lowerName = name.toLowerCase()
        return this.userRepo.factorioUsers.findOne({ name: lowerName }, { relations: AccountRelations })
    }

    @Get('/discord')
    @Authorized(1 | ApiPermission.ReadUsers)
    allDiscord() {
        debugLog('Sent all <discord> users')
        return this.userRepo.discordUsers.find({ relations: AccountRelations })
    }

    @Get('/discord/:id')
    @Authorized(1 | ApiPermission.ReadUsers)
    oneDiscord(@Param('id') id: string) {
        debugLog(`Sent one user: discord<${id}>`)
        return this.userRepo.discordUsers.findOne(id, { relations: AccountRelations })
    }

}
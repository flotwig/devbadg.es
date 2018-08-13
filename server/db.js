import Sequelize from 'sequelize';
import Promise from 'bluebird';

export default class Db {
    constructor() {
        this.sequelize = new Sequelize(process.env.PG_DBNAME, process.env.PG_USER, process.env.PG_PASS, {
            dialect: 'postgres',
            host: process.env.PG_HOST
        })
        this.addModels();
    }

    findAvailableSlug(slug, cb, i) {
        let newSlug = slug;
        if (i > 0) newSlug = slug + '-' + i;
        this.User.findOne({
            where: { slug: newSlug }
        }).then(user => {
            i = (i || 0) + 1;
            if (user) {
                this.findAvailableSlug(slug, cb, i)
            } else {
                cb(newSlug)
            }
        })
    }

    findOrCreateProvider(provider) {
        return this.Provider.findOne({
            where: { slug: provider.slug }
        }).then(foundProvider => {
            if (foundProvider) return foundProvider;
            else return this.Provider.create(provider);
        })
    }

    addModels() {
        this.Token = this.sequelize.define('token', {
            tokenId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            //providerId: { type: Sequelize.BIGINT },
            //userId: { type: Sequelize.BIGINT },
            remoteUsername: Sequelize.STRING,
            remoteId: Sequelize.STRING,
            accessToken: Sequelize.STRING,
            refreshToken: Sequelize.STRING,
            broken: { type: Sequelize.BOOLEAN, defaultValue: false },
            expiresAt: Sequelize.DATE,
            lastUsedAt: Sequelize.DATE,
            createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        });
        this.Token.prototype.getUrl = () =>
            this.getProvider().then(p => `${process.env.BASE_URL}/tokens/${p.slug}/${this.tokenId}`)
        this.User = this.sequelize.define('user', {
            userId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            emailAddress: { type: Sequelize.STRING },
            points: { type: Sequelize.INTEGER, defaultValue: 0 },
            badges: { type: Sequelize.INTEGER, defaultValue: 0 },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            lastLoginAt: Sequelize.DATE,
            createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        });
        this.BadgeEvent = this.sequelize.define('badgeEvent', {
            eventId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            //userId: Sequelize.BIGINT,
            //badgeId: Sequelize.BIGINT,
            //tokenId: Sequelize.BIGINT,
            likeCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            commentCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        });
        this.Badge = this.sequelize.define('badge', {
            badgeId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            //providerId: Sequelize.BIGINT,
            commentCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            likeCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            points: { type: Sequelize.INTEGER, defaultValue: 0 },
            earnedCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            name: { type: Sequelize.STRING, allowNull: false },
            description: { type: Sequelize.STRING, allowNull: false }
        });
        this.Provider = this.sequelize.define('provider', {
            providerId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            name: { type: Sequelize.STRING, allowNull: false },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            description: { type: Sequelize.STRING, allowNull: false },
            badgeCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            earnedCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            tokenCount: { type: Sequelize.INTEGER, defaultValue: 0 }
        });
        this.Token.belongsTo(this.Provider, { foreignKey: 'providerId' });
        this.Token.belongsTo(this.User, { foreignKey: 'userId' });
        this.BadgeEvent.belongsTo(this.User, { foreignKey: 'userId' });
        this.BadgeEvent.belongsTo(this.Badge, { foreignKey: 'badgeId', });
        this.BadgeEvent.belongsTo(this.Token, { foreignKey: 'tokenId' });
        this.Badge.belongsTo(this.Provider, { foreignKey: 'providerId' });
    }
}
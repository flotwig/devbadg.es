import Sequelize from 'sequelize';

export default class Db {
    constructor() {
        this.sequelize = new Sequelize(process.env.PG_DBNAME, process.env.PG_USER, process.env.PG_PASS, {
            dialect: 'postgres',
            host: process.env.PG_HOST
        })
        this.addModels();
    }
    addModels() {
        this.Token = this.sequelize.define('token', {
            tokenId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            providerId: { type: Sequelize.BIGINT },
            userId: { type: Sequelize.BIGINT },
            username: Sequelize.STRING,
            accessToken: Sequelize.STRING,
            refreshToken: Sequelize.STRING,
            broken: Sequelize.BOOLEAN,
            expiresAt: Sequelize.DATE,
            lastUsedAt: Sequelize.DATE,
            createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        });
        this.User = this.sequelize.define('user', {
            userId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            emailAddress: Sequelize.STRING,
            points: Sequelize.INTEGER,
            badges: Sequelize.INTEGER,
            slug: Sequelize.STRING,
            lastLoginAt: Sequelize.DATE,
            createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        });
        this.BadgeEvent = this.sequelize.define('badgeEvent', {
            eventId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            userId: Sequelize.BIGINT,
            badgeId: Sequelize.BIGINT,
            tokenId: Sequelize.BIGINT,
            likeCount: Sequelize.INTEGER,
            commentCount: Sequelize.INTEGER,
            createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        });
        this.Badge = this.sequelize.define('badge', {
            badgeId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            providerId: Sequelize.BIGINT,
            commentCount: Sequelize.INTEGER,
            likeCount: Sequelize.INTEGER,
            points: Sequelize.INTEGER,
            earnedCount: Sequelize.INTEGER,
            slug: Sequelize.STRING,
            name: Sequelize.STRING,
            description: Sequelize.STRING
        });
        this.Provider = this.sequelize.define('provider', {
            providerId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            name: Sequelize.STRING,
            slug: Sequelize.STRING,
            description: Sequelize.STRING,
            badgeCount: Sequelize.INTEGER,
            earnedCount: Sequelize.INTEGER,
            tokenCount: Sequelize.INTEGER
        });
        this.Token.belongsTo(this.Provider);
        this.User.hasMany(this.Token);
        this.User.hasMany(this.BadgeEvent);
        this.BadgeEvent.belongsTo(this.User);
        this.BadgeEvent.belongsTo(this.Badge);
        this.BadgeEvent.belongsTo(this.Token);
        this.Provider.hasMany(this.Badge);
    }
}
import Sequelize from 'sequelize';
import Promise from 'bluebird';

export default class Db {
    constructor() {
        this.sequelize = new Sequelize(process.env.PG_DBNAME, process.env.PG_USER, process.env.PG_PASS, {
            host: process.env.PG_HOST,
            // logging: false,
            dialect: 'postgres',
            ssl: false, 
            dialectOptions: { ssl: false },
            operatorsAliases: false
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
        }, {
            getterMethods: {
                profileUrl() {
                    const slug = this.getDataValue('slug')
                    return process.env.USE_SUBDOMAINS ? process.env.BASE_URL.replace('//', `//${slug}.`) : `${process.env.BASE_URL}/user/${slug}`
                }
            }
        });
        this.BadgeEvent = this.sequelize.define('badgeEvent', {
            eventId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            likeCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            commentCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        });
        this.Badge = this.sequelize.define('badge', {
            badgeId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            commentCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            likeCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            points: { type: Sequelize.INTEGER, defaultValue: 0 },
            earnedCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            name: { type: Sequelize.STRING, allowNull: false },
            description: { type: Sequelize.STRING, allowNull: false }
        });
        this.BadgeTrigger = this.sequelize.define('badgeTrigger', {
            badgeTriggerId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            minimum: { type: Sequelize.BIGINT }
        })
        this.Provider = this.sequelize.define('provider', {
            providerId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            name: { type: Sequelize.STRING, allowNull: false },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            description: { type: Sequelize.STRING, allowNull: false },
            badgeCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            earnedCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            tokenCount: { type: Sequelize.INTEGER, defaultValue: 0 }
        });
        this.Scan = this.sequelize.define('scan', {
            scanId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            value: { type: Sequelize.BIGINT },
            createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        });
        this.Scan.record = function(statisticSlug, value, token) {
            this.sequelize.query('SELECT * FROM scans s \
                RIGHT JOIN statistics t WHERE s."statisticId" = t."statisticId" \
                WHERE t.slug = :statisticSlug AND s."tokenId" = :tokenId \
                ORDER BY s."createdAt" DESC \
                LIMIT 1;', { 
                    replacements: {
                        statisticSlug,
                        tokenId: token.id
                    },
                    model: this 
                }).then(scans => {
                    if (scans.length === 0 || scans[0].value !== value) {
                        // new datapoint!
                        this.sequelize.query('INSERT INTO scans \
                        ("tokenId", value, "statisticId") VALUES \
                        (:tokenId, :value, \
                            (SELECT "statisticId" FROM statistics WHERE slug = :statisticSlug));'
                        )
                        // TODO: run badge triggers
                    }
                })
        }
        this.Statistic = this.sequelize.define('statistic', {
            statisticId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            name: { type: Sequelize.STRING, allowNull: false }
        });
        this.Statistic.load = function(statistics) {
            Object.keys(statistics).map(statistic => {
                this.findOrCreate({
                    where: {
                        'slug': statistic
                    },
                    defaults: {
                        'slug': statistic,
                        'name': statistics[statistic]
                    }
                }).spread((result, created) => true)
            })
        }
        this.Scan.belongsTo(this.Token, { foreignKey: 'tokenId' });
        this.Scan.belongsTo(this.Statistic, { foreignKey: 'statisticId' });
        this.Token.belongsTo(this.Provider, { foreignKey: 'providerId' });
        this.Token.belongsTo(this.User, { foreignKey: 'userId' });
        this.BadgeEvent.belongsTo(this.User, { foreignKey: 'userId' });
        this.BadgeEvent.belongsTo(this.Badge, { foreignKey: 'badgeId', });
        this.BadgeEvent.belongsTo(this.Token, { foreignKey: 'tokenId' });
        this.BadgeTrigger.belongsTo(this.Badge, { foreignKey: 'badgeId' });
        this.BadgeTrigger.belongsTo(this.Statistic, { foreignKey: 'statisticId' });
        this.Badge.belongsTo(this.Provider, { foreignKey: 'providerId' });
    }
}
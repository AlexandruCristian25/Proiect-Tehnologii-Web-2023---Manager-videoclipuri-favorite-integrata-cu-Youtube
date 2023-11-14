import { Sequelize } from "sequelize";
import { sequelizeconfig } from "../config.js";
import { OperatiiApi } from "./operation-api.js";

const sequelizeConection = new Sequelize(
    "VideosDB", 
    "root", 
    "root",
    sequelizeconfig,
    );

OperatiiApi.init(sequelizeConection);

export const Artist = sequelizeConection.define("Artist", {

    ArtistID: {

        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false

    },

    Name: {

        type: Sequelize.STRING,
        allowNull: false,
        trim: true
    },

    Email: {

        type: Sequelize.STRING,
        allowNull: false,
        trim: true

    }

},
    {

        indexes: [
            {

                unique: true,
                fields: ['Name', 'Email']
            }

        ]

    });

export const Songs = sequelizeConection.define("Songs", {

    SongID: {

        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false

    },

    Name: {

        type: Sequelize.STRING,
        allowNull: false,
        trim: true
    },

    Link: {

        type: Sequelize.STRING,
        allowNull: false,
        trim: true
    },

    Views: {

        type: Sequelize.INTEGER,
        allowNull: false
    }

});

export const Album = sequelizeConection.define("Albums", {

    AlbumID: {

        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false

    },

    Name: {
        type: Sequelize.STRING,
        allowNull: false,
        trim: true
    }

});

Artist.hasMany(Songs, {
    foreignKey: "Artist_ID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKeyConstraint: true

});

Artist.hasMany(Album, {
    foreignKey: "IDArtist",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKeyConstraint: true
});

Album.hasMany(Songs, {

    foreignKey: "Album_ID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKeyConstraint: true
});

export {sequelizeConection};


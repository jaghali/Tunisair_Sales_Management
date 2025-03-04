using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class EnteteOffreTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EnteteOffre",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AVION = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AIROPORT = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DATE_EDITION = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AGENT_SAISIE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NUMERO_ETAT = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FL01 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FL02 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FL03 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CC1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PNC1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NOM1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NOM2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CC2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PNC2 = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnteteOffre", x => x.ID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EnteteOffre");
        }
    }
}

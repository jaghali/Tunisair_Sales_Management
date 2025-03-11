using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class GestionArticles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FournisseurId",
                table: "Articles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Devises",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Devises", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Fournisseurs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fournisseurs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PrixArticles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArticleCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DeviseId = table.Column<int>(type: "int", nullable: false),
                    DateDepart = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateArrivee = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Prix = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrixArticles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrixArticles_Articles_ArticleCode",
                        column: x => x.ArticleCode,
                        principalTable: "Articles",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrixArticles_Devises_DeviseId",
                        column: x => x.DeviseId,
                        principalTable: "Devises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Articles_FournisseurId",
                table: "Articles",
                column: "FournisseurId");

            migrationBuilder.CreateIndex(
                name: "IX_PrixArticles_ArticleCode",
                table: "PrixArticles",
                column: "ArticleCode");

            migrationBuilder.CreateIndex(
                name: "IX_PrixArticles_DeviseId",
                table: "PrixArticles",
                column: "DeviseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Articles_Fournisseurs_FournisseurId",
                table: "Articles",
                column: "FournisseurId",
                principalTable: "Fournisseurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Articles_Fournisseurs_FournisseurId",
                table: "Articles");

            migrationBuilder.DropTable(
                name: "Fournisseurs");

            migrationBuilder.DropTable(
                name: "PrixArticles");

            migrationBuilder.DropTable(
                name: "Devises");

            migrationBuilder.DropIndex(
                name: "IX_Articles_FournisseurId",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "FournisseurId",
                table: "Articles");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddforeignkeyOFFARR : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EnteteVenteID",
                table: "EtatOffresArrivee",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ID",
                table: "EtatOffresArrivee",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.CreateIndex(
                name: "IX_EtatOffresArrivee_EnteteVenteID",
                table: "EtatOffresArrivee",
                column: "EnteteVenteID");

            migrationBuilder.AddForeignKey(
                name: "FK_EtatOffresArrivee_EnteteVente_EnteteVenteID",
                table: "EtatOffresArrivee",
                column: "EnteteVenteID",
                principalTable: "EnteteVente",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EtatOffresArrivee_EnteteVente_EnteteVenteID",
                table: "EtatOffresArrivee");

            migrationBuilder.DropIndex(
                name: "IX_EtatOffresArrivee_EnteteVenteID",
                table: "EtatOffresArrivee");

            migrationBuilder.DropColumn(
                name: "EnteteVenteID",
                table: "EtatOffresArrivee");

            migrationBuilder.DropColumn(
                name: "ID",
                table: "EtatOffresArrivee");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class aasdll : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EnteteVenteID",
                table: "EtatVentesArrivee",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_EtatVentesArrivee_EnteteVenteID",
                table: "EtatVentesArrivee",
                column: "EnteteVenteID");

            migrationBuilder.AddForeignKey(
                name: "FK_EtatVentesArrivee_EnteteVente_EnteteVenteID",
                table: "EtatVentesArrivee",
                column: "EnteteVenteID",
                principalTable: "EnteteVente",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EtatVentesArrivee_EnteteVente_EnteteVenteID",
                table: "EtatVentesArrivee");

            migrationBuilder.DropIndex(
                name: "IX_EtatVentesArrivee_EnteteVenteID",
                table: "EtatVentesArrivee");

            migrationBuilder.DropColumn(
                name: "EnteteVenteID",
                table: "EtatVentesArrivee");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddForiegnkey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EnteteVenteID",
                table: "EtatVentesDepart",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_EtatVentesDepart_EnteteVenteID",
                table: "EtatVentesDepart",
                column: "EnteteVenteID");

            migrationBuilder.AddForeignKey(
                name: "FK_EtatVentesDepart_EnteteVente_EnteteVenteID",
                table: "EtatVentesDepart",
                column: "EnteteVenteID",
                principalTable: "EnteteVente",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EtatVentesDepart_EnteteVente_EnteteVenteID",
                table: "EtatVentesDepart");

            migrationBuilder.DropIndex(
                name: "IX_EtatVentesDepart_EnteteVenteID",
                table: "EtatVentesDepart");

            migrationBuilder.DropColumn(
                name: "EnteteVenteID",
                table: "EtatVentesDepart");
        }
    }
}

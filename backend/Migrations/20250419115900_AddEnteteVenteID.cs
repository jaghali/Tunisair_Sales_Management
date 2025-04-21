using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddEnteteVenteID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TauxChanges_Devises_DeviseId",
                table: "TauxChanges");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TauxChanges",
                table: "TauxChanges");

            migrationBuilder.RenameTable(
                name: "TauxChanges",
                newName: "TauxChange");

            migrationBuilder.RenameIndex(
                name: "IX_TauxChanges_DeviseId",
                table: "TauxChange",
                newName: "IX_TauxChange_DeviseId");

            migrationBuilder.AddColumn<int>(
                name: "EnteteVenteID",
                table: "EtatVentesDepart",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TauxChange",
                table: "TauxChange",
                column: "Id");

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

            migrationBuilder.AddForeignKey(
                name: "FK_TauxChange_Devises_DeviseId",
                table: "TauxChange",
                column: "DeviseId",
                principalTable: "Devises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EtatVentesDepart_EnteteVente_EnteteVenteID",
                table: "EtatVentesDepart");

            migrationBuilder.DropForeignKey(
                name: "FK_TauxChange_Devises_DeviseId",
                table: "TauxChange");

            migrationBuilder.DropIndex(
                name: "IX_EtatVentesDepart_EnteteVenteID",
                table: "EtatVentesDepart");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TauxChange",
                table: "TauxChange");

            migrationBuilder.DropColumn(
                name: "EnteteVenteID",
                table: "EtatVentesDepart");

            migrationBuilder.RenameTable(
                name: "TauxChange",
                newName: "TauxChanges");

            migrationBuilder.RenameIndex(
                name: "IX_TauxChange_DeviseId",
                table: "TauxChanges",
                newName: "IX_TauxChanges_DeviseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TauxChanges",
                table: "TauxChanges",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TauxChanges_Devises_DeviseId",
                table: "TauxChanges",
                column: "DeviseId",
                principalTable: "Devises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

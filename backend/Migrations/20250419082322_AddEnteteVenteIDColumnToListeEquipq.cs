using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddEnteteVenteIDColumnToListeEquipq : Migration
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

            migrationBuilder.RenameColumn(
                name: "AVION",
                table: "EnteteVente",
                newName: "FOURNISSEUR");

            migrationBuilder.RenameIndex(
                name: "IX_TauxChanges_DeviseId",
                table: "TauxChange",
                newName: "IX_TauxChange_DeviseId");

            migrationBuilder.AddColumn<int>(
                name: "EnteteVenteID",
                table: "ListeEquipageV",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TauxChange",
                table: "TauxChange",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ListeEquipageV_EnteteVenteID",
                table: "ListeEquipageV",
                column: "EnteteVenteID");

            migrationBuilder.AddForeignKey(
                name: "FK_ListeEquipageV_EnteteVente_EnteteVenteID",
                table: "ListeEquipageV",
                column: "EnteteVenteID",
                principalTable: "EnteteVente",
                principalColumn: "ID");

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
                name: "FK_ListeEquipageV_EnteteVente_EnteteVenteID",
                table: "ListeEquipageV");

            migrationBuilder.DropForeignKey(
                name: "FK_TauxChange_Devises_DeviseId",
                table: "TauxChange");

            migrationBuilder.DropIndex(
                name: "IX_ListeEquipageV_EnteteVenteID",
                table: "ListeEquipageV");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TauxChange",
                table: "TauxChange");

            migrationBuilder.DropColumn(
                name: "EnteteVenteID",
                table: "ListeEquipageV");

            migrationBuilder.RenameTable(
                name: "TauxChange",
                newName: "TauxChanges");

            migrationBuilder.RenameColumn(
                name: "FOURNISSEUR",
                table: "EnteteVente",
                newName: "AVION");

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

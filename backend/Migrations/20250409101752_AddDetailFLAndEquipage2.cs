using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDetailFLAndEquipage2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipages_DetailFLs_NUMFL_MAT",
                table: "Equipages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Equipages",
                table: "Equipages");

            migrationBuilder.AlterColumn<int>(
                name: "MAT",
                table: "Equipages",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("Relational:ColumnOrder", 2);

            migrationBuilder.AlterColumn<int>(
                name: "NUMFL",
                table: "Equipages",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("Relational:ColumnOrder", 1);

            migrationBuilder.AddColumn<int>(
                name: "ID",
                table: "Equipages",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Equipages",
                table: "Equipages",
                column: "ID");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_DetailFLs_NUMFL",
                table: "DetailFLs",
                column: "NUMFL");

            migrationBuilder.CreateIndex(
                name: "IX_Equipages_NUMFL",
                table: "Equipages",
                column: "NUMFL");

            migrationBuilder.CreateIndex(
                name: "IX_DetailFLs_NUMFL",
                table: "DetailFLs",
                column: "NUMFL",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipages_DetailFLs_NUMFL",
                table: "Equipages",
                column: "NUMFL",
                principalTable: "DetailFLs",
                principalColumn: "NUMFL",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipages_DetailFLs_NUMFL",
                table: "Equipages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Equipages",
                table: "Equipages");

            migrationBuilder.DropIndex(
                name: "IX_Equipages_NUMFL",
                table: "Equipages");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_DetailFLs_NUMFL",
                table: "DetailFLs");

            migrationBuilder.DropIndex(
                name: "IX_DetailFLs_NUMFL",
                table: "DetailFLs");

            migrationBuilder.DropColumn(
                name: "ID",
                table: "Equipages");

            migrationBuilder.AlterColumn<int>(
                name: "NUMFL",
                table: "Equipages",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("Relational:ColumnOrder", 1);

            migrationBuilder.AlterColumn<int>(
                name: "MAT",
                table: "Equipages",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("Relational:ColumnOrder", 2);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Equipages",
                table: "Equipages",
                columns: new[] { "NUMFL", "MAT" });

            migrationBuilder.AddForeignKey(
                name: "FK_Equipages_DetailFLs_NUMFL_MAT",
                table: "Equipages",
                columns: new[] { "NUMFL", "MAT" },
                principalTable: "DetailFLs",
                principalColumns: new[] { "NUMFL", "NUMVOL" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDetailFLKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropPrimaryKey(
                name: "PK_DetailFLs",
                table: "DetailFLs");

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
                .Annotation("Relational:ColumnOrder", 2)
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<int>(
                name: "NUMVOL",
                table: "DetailFLs",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)")
                .Annotation("Relational:ColumnOrder", 1);

            migrationBuilder.AlterColumn<int>(
                name: "NUMFL",
                table: "DetailFLs",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("Relational:ColumnOrder", 0)
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Equipages",
                table: "Equipages",
                columns: new[] { "NUMFL", "MAT" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_DetailFLs",
                table: "DetailFLs",
                columns: new[] { "NUMFL", "NUMVOL" });

            migrationBuilder.AddForeignKey(
                name: "FK_Equipages_DetailFLs_NUMFL_MAT",
                table: "Equipages",
                columns: new[] { "NUMFL", "MAT" },
                principalTable: "DetailFLs",
                principalColumns: new[] { "NUMFL", "NUMVOL" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipages_DetailFLs_NUMFL_MAT",
                table: "Equipages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Equipages",
                table: "Equipages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DetailFLs",
                table: "DetailFLs");

            migrationBuilder.AlterColumn<int>(
                name: "MAT",
                table: "Equipages",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1")
                .OldAnnotation("Relational:ColumnOrder", 2);

            migrationBuilder.AlterColumn<int>(
                name: "NUMFL",
                table: "Equipages",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("Relational:ColumnOrder", 1);

            migrationBuilder.AlterColumn<string>(
                name: "NUMVOL",
                table: "DetailFLs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("Relational:ColumnOrder", 1);

            migrationBuilder.AlterColumn<int>(
                name: "NUMFL",
                table: "DetailFLs",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1")
                .OldAnnotation("Relational:ColumnOrder", 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Equipages",
                table: "Equipages",
                column: "MAT");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DetailFLs",
                table: "DetailFLs",
                column: "NUMFL");

            migrationBuilder.CreateIndex(
                name: "IX_Equipages_NUMFL",
                table: "Equipages",
                column: "NUMFL");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipages_DetailFLs_NUMFL",
                table: "Equipages",
                column: "NUMFL",
                principalTable: "DetailFLs",
                principalColumn: "NUMFL",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

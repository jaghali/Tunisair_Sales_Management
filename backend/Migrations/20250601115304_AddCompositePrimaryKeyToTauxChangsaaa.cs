using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCompositePrimaryKeyToTauxChangsaaa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TauxChange",
                table: "TauxChange");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "TauxChange",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TauxChange",
                table: "TauxChange",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TauxChange",
                table: "TauxChange");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "TauxChange",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TauxChange",
                table: "TauxChange",
                columns: new[] { "Id", "Date" });
        }
    }
}

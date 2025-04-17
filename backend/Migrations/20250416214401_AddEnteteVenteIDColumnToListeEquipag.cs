using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddEnteteVenteIDColumnToListeEquipag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DetailFLs",
                columns: table => new
                {
                    NUMFL = table.Column<int>(type: "int", nullable: false),
                    NUMVOL = table.Column<int>(type: "int", nullable: false),
                    CIE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DATEVOL = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ESCALEDEP = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ESCALEARR = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NUMORDRE = table.Column<int>(type: "int", nullable: false),
                    DATEDEPPREV = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HEUREBBDEP = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HEUREBBARR = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DUREEVOLBB = table.Column<int>(type: "int", nullable: false),
                    HEUREABDEP = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HEUREABARR = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DUREEVOLAB = table.Column<int>(type: "int", nullable: false),
                    CARBVOLPREC = table.Column<int>(type: "int", nullable: false),
                    CARBRAVUNITE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CARBRAV = table.Column<int>(type: "int", nullable: false),
                    CARBCOEFCONV = table.Column<float>(type: "real", nullable: false),
                    CARBRAVKG = table.Column<int>(type: "int", nullable: false),
                    CARBJAUGEDEP = table.Column<int>(type: "int", nullable: false),
                    CARBJAUGEARR = table.Column<int>(type: "int", nullable: false),
                    CARBCONSOM = table.Column<int>(type: "int", nullable: false),
                    VOLOPERATIONNEL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DATEVOLOP = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MAT = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetailFLs", x => new { x.NUMFL, x.NUMVOL });
                });

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

            migrationBuilder.CreateTable(
                name: "EnteteVente",
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
                    PNC2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotaleEncaisse = table.Column<double>(type: "float", nullable: true),
                    TotaleValeur = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnteteVente", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "EtatOffresArrivee",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuantiteDotation = table.Column<int>(type: "int", nullable: false),
                    TotEm = table.Column<int>(type: "int", nullable: false),
                    QuantiteOfferte = table.Column<int>(type: "int", nullable: false),
                    Restant = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EtatOffresArrivee", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "EtatOffresDepart",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuantiteDotation = table.Column<int>(type: "int", nullable: false),
                    TotEm = table.Column<int>(type: "int", nullable: false),
                    QuantiteOfferte = table.Column<int>(type: "int", nullable: false),
                    Restant = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EtatOffresDepart", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "EtatVentesArrivee",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuantiteDotation = table.Column<int>(type: "int", nullable: false),
                    TotEm = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    QuantiteVendue = table.Column<int>(type: "int", nullable: false),
                    PrixUnitaireHT = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Valeur = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Restant = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EtatVentesArrivee", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "EtatVentesDepart",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QtDotation = table.Column<int>(type: "int", nullable: false),
                    QtCompJ = table.Column<int>(type: "int", nullable: false),
                    TotEm = table.Column<int>(type: "int", nullable: false),
                    QuantiteCasse = table.Column<int>(type: "int", nullable: false),
                    QuantiteOffre = table.Column<int>(type: "int", nullable: false),
                    QuantiteVente = table.Column<int>(type: "int", nullable: false),
                    PrixUnitaireHT = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Valeur = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Restant = table.Column<int>(type: "int", nullable: false),
                    DateVente = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EtatVentesDepart", x => x.Code);
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
                name: "ListeEquipageO",
                columns: table => new
                {
                    MATRICULE = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PNC = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DONNEES = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DESTINATION = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListeEquipageO", x => x.MATRICULE);
                });

            migrationBuilder.CreateTable(
                name: "ListeEquipageV",
                columns: table => new
                {
                    MATRICULE = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PNC = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DONNEES = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DESTINATION = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListeEquipageV", x => x.MATRICULE);
                });

            migrationBuilder.CreateTable(
                name: "PN",
                columns: table => new
                {
                    MATRICULE = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prenom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BASE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    COLLEGE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SECTEUR = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PN", x => x.MATRICULE);
                });

            migrationBuilder.CreateTable(
                name: "Utilisateurs",
                columns: table => new
                {
                    Matricule = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prenom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pwd = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utilisateurs", x => x.Matricule);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Equipages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NUMFL = table.Column<int>(type: "int", nullable: false),
                    MAT = table.Column<int>(type: "int", nullable: false),
                    CLE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FONCTION = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PILOTEENVOL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DetailFLNUMFL = table.Column<int>(type: "int", nullable: true),
                    DetailFLNUMVOL = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipages", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Equipages_DetailFLs_DetailFLNUMFL_DetailFLNUMVOL",
                        columns: x => new { x.DetailFLNUMFL, x.DetailFLNUMVOL },
                        principalTable: "DetailFLs",
                        principalColumns: new[] { "NUMFL", "NUMVOL" });
                });

            migrationBuilder.CreateTable(
                name: "Articles",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FournisseurId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Articles", x => x.Code);
                    table.ForeignKey(
                        name: "FK_Articles_Fournisseurs_FournisseurId",
                        column: x => x.FournisseurId,
                        principalTable: "Fournisseurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_DetailFLs_NUMFL",
                table: "DetailFLs",
                column: "NUMFL");

            migrationBuilder.CreateIndex(
                name: "IX_Equipages_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages",
                columns: new[] { "DetailFLNUMFL", "DetailFLNUMVOL" });

            migrationBuilder.CreateIndex(
                name: "IX_PrixArticles_ArticleCode",
                table: "PrixArticles",
                column: "ArticleCode");

            migrationBuilder.CreateIndex(
                name: "IX_PrixArticles_DeviseId",
                table: "PrixArticles",
                column: "DeviseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "EnteteOffre");

            migrationBuilder.DropTable(
                name: "EnteteVente");

            migrationBuilder.DropTable(
                name: "Equipages");

            migrationBuilder.DropTable(
                name: "EtatOffresArrivee");

            migrationBuilder.DropTable(
                name: "EtatOffresDepart");

            migrationBuilder.DropTable(
                name: "EtatVentesArrivee");

            migrationBuilder.DropTable(
                name: "EtatVentesDepart");

            migrationBuilder.DropTable(
                name: "ListeEquipageO");

            migrationBuilder.DropTable(
                name: "ListeEquipageV");

            migrationBuilder.DropTable(
                name: "PN");

            migrationBuilder.DropTable(
                name: "PrixArticles");

            migrationBuilder.DropTable(
                name: "Utilisateurs");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "DetailFLs");

            migrationBuilder.DropTable(
                name: "Articles");

            migrationBuilder.DropTable(
                name: "Devises");

            migrationBuilder.DropTable(
                name: "Fournisseurs");
        }
    }
}

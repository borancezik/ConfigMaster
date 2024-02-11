﻿// <auto-generated />
using ConfigMaster.Server.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ConfigMaster.Server.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    partial class ApplicationContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ConfigMaster.Server.Features.Application.Domain.ApplicationEntity", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("Domain")
                        .HasColumnType("text")
                        .HasColumnName("domain");

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<string>("Port")
                        .HasColumnType("text")
                        .HasColumnName("port");

                    b.HasKey("Id");

                    b.ToTable("applications");
                });

            modelBuilder.Entity("ConfigMaster.Server.Features.Config.Domain.ConfigEntity", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long>("ApplicationId")
                        .HasColumnType("bigint")
                        .HasColumnName("application_id");

                    b.Property<string>("Config")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("config");

                    b.Property<int>("ConfigType")
                        .HasColumnType("integer")
                        .HasColumnName("config_type");

                    b.Property<int>("EnvType")
                        .HasColumnType("integer")
                        .HasColumnName("env_type");

                    b.HasKey("Id");

                    b.HasIndex("ApplicationId");

                    b.ToTable("configs");
                });

            modelBuilder.Entity("ConfigMaster.Server.Features.Config.Domain.ConfigEntity", b =>
                {
                    b.HasOne("ConfigMaster.Server.Features.Application.Domain.ApplicationEntity", "Application")
                        .WithMany()
                        .HasForeignKey("ApplicationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Application");
                });
#pragma warning restore 612, 618
        }
    }
}

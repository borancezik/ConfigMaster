using ConfigMaster.Server.Common.Models.Entity;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ConfigMaster.Server.Features.Application.Domain;

public class ApplicationEntity : IEntity
{
    [Column("id")]
    [Key]
    public long Id { get; set; }

    [Column("name")]
    public string? Name { get; set; }

    [Column("domain")]
    public string? Domain { get; set; }

    [Column("port")]
    public string? Port { get; set; }
}

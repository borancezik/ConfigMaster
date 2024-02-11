using ConfigMaster.Server.Common.Models.Entity;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ConfigMaster.Server.Features.Application.Domain;

namespace ConfigMaster.Server.Features.Config.Domain;

public class ConfigEntity : IEntity
{
    [Column("id")]
    [Key]
    public long Id { get; set; }

    [Column("application_id")]
    public long ApplicationId { get; set; }

    [Column("env_type")]
    public int EnvType { get; set; }

    [Column("config_type")]
    public int ConfigType { get; set; }

    [Column("config")]
    public string Config { get; set; }

    [ForeignKey("ApplicationId")]
    public ApplicationEntity Application { get; set; }
}

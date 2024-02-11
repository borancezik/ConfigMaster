using FluentValidation;

namespace ConfigMaster.Features.Config.Command.AddCommand;

public class ConfigCommandValidator : AbstractValidator<ConfigCommand>
{
    public ConfigCommandValidator()
    {
        RuleFor(x => x.ConfigType)
        .LessThanOrEqualTo(4)
        .WithMessage("ConfigType alanı 4 değerinden büyük olamaz.");
    }
}

const addPropertyControls = jest.fn()

enum ControlType {
    String = "string",
    Number = "number",
    Boolean = "boolean",
    Enum = "enum",
    Color = "color",
    EventHandler = "eventhandler"
}

module.exports = {
    addPropertyControls,
    ControlType
} 
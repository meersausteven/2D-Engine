
class InteractableObject extends GameObject {
        type = "Interactable Object";
        name = "New InteractableObject";

        constructor(game, x, y, width, height, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);
                
                // special state for this specific object
                this.state = null;
                // is this still interactable? (final state reached?)
                this.interactable = true;
                // array of things this object contains (item, drops, etc.)
                this.items = [];
        }

        onAction(actor = null, actionType = null) {
                // actor: gameobject
                // actionType: type of action (collision, buttonpress, etc.)
                
                if (actor == null || actionType == null) {
                        return;
                }
        }
}
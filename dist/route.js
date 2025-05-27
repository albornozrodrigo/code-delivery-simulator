"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Route {
    constructor(clientId, routeId) {
        this.clientId = clientId;
        this.routeId = routeId;
        this.positions = [];
    }
    async loadPositions() {
        if (!this.routeId) {
            throw new Error('route ID is empty');
        }
        const filePath = path_1.default.join(__dirname, 'destinations', `${this.routeId}.txt`);
        try {
            const data = fs_1.default.readFileSync(filePath, 'utf-8');
            const lines = data.split('\n').filter(Boolean);
            for (const line of lines) {
                const parts = line.split(',');
                const lat = parts[0];
                const lng = parts[1];
                if (lat !== '' && lng !== '') {
                    this.positions.push({ lat, lng });
                }
            }
        }
        catch (err) {
            throw err;
        }
    }
    exportJsonPositions() {
        const result = [];
        const total = this.positions.length;
        for (let k = 0; k < total; k++) {
            const pos = this.positions[k];
            const finished = (k === total - 1);
            const route = {
                routeId: this.routeId,
                clientId: this.clientId,
                position: [pos.lat, pos.lng],
                finished
            };
            const jsonData = JSON.stringify(route);
            result.push(jsonData);
        }
        return result;
    }
}
exports.default = Route;

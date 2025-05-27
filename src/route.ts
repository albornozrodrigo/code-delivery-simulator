import fs from 'fs';
import path from 'path';

type Positions = {
  lat: string;
  lng: string;
}

export default class Route {
  routeId: string;
  clientId: string;
  positions: Positions[];

  constructor(clientId: string, routeId: string) {
    this.clientId = clientId;
    this.routeId = routeId;
    this.positions = [];
  }

  async loadPositions() {
    if (!this.routeId) {
      throw new Error('route ID is empty');
    }

    const filePath = path.join(__dirname, 'destinations', `${this.routeId}.txt`);

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const lines = data.split('\n').filter(Boolean);

      for (const line of lines) {
        const parts = line.split(',');
        const lat = parts[0];
        const lng = parts[1];

        if (lat !== '' && lng !== '') {
          this.positions.push({ lat, lng });
        }
      }
    } catch (err) {
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

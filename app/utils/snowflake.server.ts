/**
 * Snowflake ID generator optimized for Remix.js backend
 * Provides a distributed-friendly unique ID generation mechanism
 */
export interface SnowflakeIdOptions {
  workerId?: number;
  datacenterId?: number;
}

export interface ParsedSnowflakeId {
  timestamp: number;
  datacenterId: number;
  workerId: number;
  sequence: number;
}

export class SnowflakeIdGenerator {
  private epoch: number;
  private workerIdBits: number;
  private datacenterIdBits: number;
  private sequenceBits: number;

  private maxWorkerId: number;
  private maxDatacenterId: number;

  private workerIdShift: number;
  private datacenterIdShift: number;
  private timestampLeftShift: number;

  private workerId: number;
  private datacenterId: number;
  private sequence: number;
  private lastTimestamp: number;

  constructor(options: SnowflakeIdOptions = {}) {
    const { workerId = 0, datacenterId = 0 } = options;

    // Snowflake ID components
    this.epoch = 1609459200000; // Custom epoch (Jan 1, 2021)

    // Bit allocation
    this.workerIdBits = 5;
    this.datacenterIdBits = 5;
    this.sequenceBits = 12;

    // Max values for each component
    this.maxWorkerId = -1 ^ (-1 << this.workerIdBits);
    this.maxDatacenterId = -1 ^ (-1 << this.datacenterIdBits);

    // Bit shifts
    this.workerIdShift = this.sequenceBits;
    this.datacenterIdShift = this.sequenceBits + this.workerIdBits;
    this.timestampLeftShift =
      this.sequenceBits + this.workerIdBits + this.datacenterIdBits;

    // Validation
    if (workerId > this.maxWorkerId || workerId < 0) {
      throw new Error(`Worker ID must be between 0 and ${this.maxWorkerId}`);
    }
    if (datacenterId > this.maxDatacenterId || datacenterId < 0) {
      throw new Error(
        `Datacenter ID must be between 0 and ${this.maxDatacenterId}`
      );
    }

    // Instance properties
    this.workerId = workerId;
    this.datacenterId = datacenterId;
    this.sequence = 0;
    this.lastTimestamp = -1;
  }

  /**
   * Generate a unique Snowflake ID
   * @returns {number} Unique identifier
   */
  generate(): number {
    let timestamp = Date.now();

    // Check for clock going backwards
    if (timestamp < this.lastTimestamp) {
      throw new Error("Clock moved backwards. Refusing to generate ID.");
    }

    // If same millisecond, increment sequence
    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & ((1 << this.sequenceBits) - 1);

      // Sequence overflow
      if (this.sequence === 0) {
        // Wait for next millisecond
        timestamp = this.waitNextMillis(this.lastTimestamp);
      }
    } else {
      // Reset sequence for new millisecond
      this.sequence = 0;
    }

    // Update last timestamp
    this.lastTimestamp = timestamp;

    // Construct the Snowflake ID
    return (
      ((timestamp - this.epoch) << this.timestampLeftShift) |
      (this.datacenterId << this.datacenterIdShift) |
      (this.workerId << this.workerIdShift) |
      this.sequence
    );
  }

  /**
   * Wait for next millisecond if sequence is exhausted
   * @param lastTimestamp
   * @returns {number} Next available timestamp
   */
  private waitNextMillis(lastTimestamp: number): number {
    let timestamp = Date.now();
    while (timestamp <= lastTimestamp) {
      timestamp = Date.now();
    }
    return timestamp;
  }

  /**
   * Parse a Snowflake ID into its components
   * @param id Snowflake ID to parse
   * @returns {ParsedSnowflakeId} Parsed ID components
   */
  parseSnowflakeId(id: bigint): ParsedSnowflakeId {
    const idNumber = Number(id);
    return {
      timestamp: Number((idNumber >> this.timestampLeftShift) + this.epoch),
      datacenterId:
        (idNumber >> this.datacenterIdShift) &
        ((1 << this.datacenterIdBits) - 1),
      workerId:
        (idNumber >> this.workerIdShift) & ((1 << this.workerIdBits) - 1),
      sequence: idNumber & ((1 << this.sequenceBits) - 1),
    };
  }
}

// Singleton instance for easy use
export const snowflakeGenerator = new SnowflakeIdGenerator();

// Example usage in a Remix loader or action
export function newSnowflakeID(): number {
  return snowflakeGenerator.generate();
}


